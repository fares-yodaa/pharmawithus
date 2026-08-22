import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, XCircle, Clock, ShieldOff, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';
import {
  AdminPageHeader,
  AdminSearchInput,
  AdminCard,
  AdminLoading,
  AdminStatusBadge,
  AdminEmptyState,
  AdminModal,
  AdminPrimaryButton,
} from '../../components/admin/admin-ui';

interface UserRow {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
  email: string;
  order_count: number;
}

export function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await api.get('/admin/users');
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const loadUserDetails = async (userId: string) => {
    setModalLoading(true);
    setSelectedUser(null);
    try {
      const [userData, coursesData] = await Promise.all([
        api.get(`/admin/users/${userId}`),
        api.get('/admin/courses'),
      ]);
      setSelectedUser(userData);
      setCourses(coursesData.filter((c: any) => c.is_active));
    } catch (err) {
      console.error('Failed to load user details:', err);
      setSelectedUser(false);
    } finally {
      setModalLoading(false);
    }
  };

  const assignCourse = async () => {
    if (!selectedCourseId || !selectedUser) return;
    setAssigning(true);
    try {
      await api.post(`/admin/users/${selectedUser.id}/assign-course?course_id=${selectedCourseId}`, {});
      const userData = await api.get(`/admin/users/${selectedUser.id}`);
      setSelectedUser(userData);
      setSelectedCourseId('');
      toast.success('Course assigned successfully!');
      fetchUsers();
    } catch (err) {
      console.error('Failed to assign course:', err);
    } finally {
      setAssigning(false);
    }
  };

  const revokeCourse = async (courseId: string, courseTitle: string) => {
    if (!selectedUser) return;
    if (!confirm(`Revoke access to "${courseTitle}" for this user?`)) return;
    setRevoking(courseId);
    try {
      await api.delete(`/admin/users/${selectedUser.id}/courses/${courseId}`);
      const userData = await api.get(`/admin/users/${selectedUser.id}`);
      setSelectedUser(userData);
      toast.success('Access revoked.');
      fetchUsers();
    } catch (err) {
      console.error('Failed to revoke course:', err);
    } finally {
      setRevoking(null);
    }
  };

  const filtered = users.filter((u) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return u.full_name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
  });

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Users"
        description="View students, assign course access manually, and manage enrollment history."
      />

      <div className="mb-6 max-w-md">
        <AdminSearchInput value={search} onChange={setSearch} placeholder="Search name or email…" />
      </div>

      <AdminCard>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Orders</th>
                <th>Joined</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <AdminEmptyState message="No users found." />
                  </td>
                </tr>
              ) : (
                filtered.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="admin-avatar">{u.full_name.charAt(0).toUpperCase()}</div>
                        <div>
                          <p className="font-semibold text-text">{u.full_name}</p>
                          <p className="text-xs text-text-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-badge admin-badge--pending capitalize">{u.role}</span>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1.5 text-sm text-text-secondary">
                        <BookOpen className="w-3.5 h-3.5 text-brand" />
                        {u.order_count}
                      </span>
                    </td>
                    <td className="text-xs text-text-muted">
                      {new Date(u.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => loadUserDetails(u.id)}
                        className="admin-btn admin-btn--ghost admin-btn--sm"
                      >
                        Manage access
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <AdminModal
        open={(!!selectedUser || modalLoading) && selectedUser !== false}
        onClose={() => setSelectedUser(null)}
        title={selectedUser?.full_name ?? 'User'}
        subtitle={selectedUser?.email}
        wide
      >
        {modalLoading ? (
          <AdminLoading />
        ) : selectedUser ? (
          <div className="space-y-6">
            <div className="rounded-2xl p-5 border border-border bg-bg-soft">
              <h4 className="font-heading font-bold text-sm text-text mb-3">Assign a course</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="admin-input appearance-none pr-10"
                  >
                    <option value="">Select a course…</option>
                    {courses.map((c) => {
                      const alreadyOwns = selectedUser.orders.some(
                        (o: any) => o.course?.id === c.id && o.status === 'approved'
                      );
                      return (
                        <option key={c.id} value={c.id} disabled={alreadyOwns}>
                          {c.title}
                          {alreadyOwns ? ' (has access)' : ''}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                </div>
                <AdminPrimaryButton onClick={assignCourse} disabled={!selectedCourseId || assigning} className="shrink-0">
                  <BookOpen className="w-4 h-4" />
                  {assigning ? 'Assigning…' : 'Assign'}
                </AdminPrimaryButton>
              </div>
            </div>

            <div>
              <h4 className="font-heading font-bold text-sm text-text mb-3">
                Course access · {selectedUser.orders.length} records
              </h4>
              {selectedUser.orders.length === 0 ? (
                <AdminEmptyState message="This user has no orders or courses yet." />
              ) : (
                <div className="space-y-3">
                  {selectedUser.orders.map((o: any) => (
                    <div
                      key={o.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border bg-white"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-text truncate">
                          {o.course?.title || 'Unknown course'}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">
                          {new Date(o.created_at).toLocaleDateString('en-GB')} ·{' '}
                          {o.amount > 0 ? `Paid $${o.amount}` : 'Manually assigned'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {o.status === 'approved' && (
                          <>
                            <span className="admin-badge admin-badge--approved">
                              <CheckCircle2 className="w-3 h-3" /> Access
                            </span>
                            <button
                              type="button"
                              onClick={() => revokeCourse(o.course?.id, o.course?.title)}
                              disabled={revoking === o.course?.id}
                              className="admin-btn admin-btn--ghost admin-btn--sm text-red-500"
                            >
                              <ShieldOff className="w-3.5 h-3.5" />
                              {revoking === o.course?.id ? '…' : 'Revoke'}
                            </button>
                          </>
                        )}
                        {o.status === 'pending' && (
                          <span className="admin-badge admin-badge--pending">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                        {o.status === 'rejected' && (
                          <span className="admin-badge admin-badge--rejected">
                            <XCircle className="w-3 h-3" /> Rejected
                          </span>
                        )}
                        {o.status !== 'approved' && o.status !== 'pending' && o.status !== 'rejected' && (
                          <AdminStatusBadge status={o.status} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </AdminModal>
    </div>
  );
}
