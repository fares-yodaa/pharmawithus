import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, BookOpen, X, Clock, CheckCircle2, XCircle, ShieldOff, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';

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

  // Modal states
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

  useEffect(() => { fetchUsers(); }, []);

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
    if (!confirm(`Revoke access to "${courseTitle}" for this user? This will delete the access record.`)) return;
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

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-text mb-1">Users</h1>
      <p className="text-sm text-text-muted mb-6">View and manage student course access.</p>

      <div className="relative w-full mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-text focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10" />
      </div>

      <div className="rounded-2xl bg-white border border-border card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-bg-soft">
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">User</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Role</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Orders</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Joined</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-text-muted">No users found.</td></tr>
              ) : (
                filtered.map((u, i) => (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-bg-soft/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-lighter flex items-center justify-center text-brand text-xs font-bold shrink-0">{u.full_name.charAt(0).toUpperCase()}</div>
                        <div>
                          <p className="text-sm font-semibold text-text">{u.full_name}</p>
                          <p className="text-xs text-text-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-bg-muted text-text-muted border border-border capitalize">
                        <User className="w-3 h-3" /> {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1 text-sm text-text-secondary"><BookOpen className="w-3.5 h-3.5" /> {u.order_count}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-text-muted">{new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => loadUserDetails(u.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand hover:bg-brand-lighter transition-colors cursor-pointer bg-transparent border-none">
                        Manage Courses
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {(selectedUser || modalLoading) && selectedUser !== false && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedUser(null)} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="fixed inset-0 z-[51] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white border border-border p-6 shadow-2xl pointer-events-auto">
              <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-lighter flex items-center justify-center text-brand font-bold text-lg">
                    {selectedUser ? selectedUser.full_name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl text-text">
                      {selectedUser ? selectedUser.full_name : 'Loading User...'}
                    </h3>
                    <p className="text-sm text-text-muted">{selectedUser ? selectedUser.email : 'Please wait'}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="w-8 h-8 rounded-full bg-bg-muted flex items-center justify-center text-text-muted hover:text-text cursor-pointer border-none"><X className="w-4 h-4" /></button>
              </div>

              {modalLoading ? (
                <div className="flex items-center justify-center py-20 flex-1"><div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>
              ) : selectedUser && (
                <div className="overflow-y-auto custom-scrollbar pr-2 space-y-6">

                  {/* Assign Course */}
                  <div className="bg-bg-soft rounded-2xl p-5 border border-border">
                    <h4 className="font-heading font-bold text-sm text-text mb-3">Assign a Course</h4>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <select
                          value={selectedCourseId}
                          onChange={(e) => setSelectedCourseId(e.target.value)}
                          className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border border-border bg-white text-sm text-text focus:outline-none focus:border-brand"
                        >
                          <option value="">Select a course...</option>
                          {courses.map(c => {
                            const alreadyOwns = selectedUser.orders.some((o: any) => o.course?.id === c.id && o.status === 'approved');
                            return (
                              <option key={c.id} value={c.id} disabled={alreadyOwns}>
                                {c.title}{alreadyOwns ? ' (Already Has Access)' : ''}
                              </option>
                            );
                          })}
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                      </div>
                      <button
                        onClick={assignCourse}
                        disabled={!selectedCourseId || assigning}
                        className="px-5 py-2.5 rounded-xl bg-brand text-white font-bold text-sm hover:bg-brand-dark transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
                      >
                        {assigning ? 'Assigning...' : <><BookOpen className="w-4 h-4" /> Assign</>}
                      </button>
                    </div>
                  </div>

                  {/* Access History */}
                  <div>
                    <h4 className="font-heading font-bold text-sm text-text mb-3 flex items-center justify-between">
                      <span>Course Access History</span>
                      <span className="text-xs font-normal text-text-muted">{selectedUser.orders.length} records</span>
                    </h4>

                    {selectedUser.orders.length === 0 ? (
                      <div className="text-center py-10 bg-bg-soft rounded-2xl border border-border border-dashed">
                        <p className="text-sm text-text-muted">This user has no orders or courses yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedUser.orders.map((o: any) => (
                          <div key={o.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-white hover:border-brand/30 transition-colors gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-text truncate">{o.course?.title || 'Unknown Course'}</p>
                              <p className="text-xs text-text-muted mt-0.5">
                                {new Date(o.created_at).toLocaleDateString()} • {o.amount > 0 ? `Paid £${o.amount}` : 'Manually Assigned'}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {o.status === 'approved' && (
                                <>
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold border border-green-100">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Access Granted
                                  </span>
                                  <button
                                    onClick={() => revokeCourse(o.course?.id, o.course?.title)}
                                    disabled={revoking === o.course?.id}
                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer bg-transparent border-none disabled:opacity-50"
                                  >
                                    <ShieldOff className="w-3.5 h-3.5" />
                                    {revoking === o.course?.id ? '...' : 'Revoke'}
                                  </button>
                                </>
                              )}
                              {o.status === 'pending' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold border border-orange-100">
                                  <Clock className="w-3.5 h-3.5" /> Pending Payment
                                </span>
                              )}
                              {o.status === 'rejected' && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100">
                                  <XCircle className="w-3.5 h-3.5" /> Rejected
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
