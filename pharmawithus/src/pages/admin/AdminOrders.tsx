import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Image as ImageIcon } from 'lucide-react';
import { api } from '../../lib/api';
import {
  AdminPageHeader,
  AdminSearchInput,
  AdminFilterPills,
  AdminCard,
  AdminLoading,
  AdminStatusBadge,
  AdminEmptyState,
  AdminModal,
  AdminDetailRow,
  AdminFieldLabel,
} from '../../components/admin/admin-ui';

interface OrderRow {
  id: string;
  user_id: string;
  status: string;
  payer_name: string;
  payer_email: string;
  payer_phone: string | null;
  amount: number;
  proof_image_path: string | null;
  admin_note: string | null;
  created_at: string;
  course: { title: string; currency: string } | null;
}

const FILTERS = ['all', 'pending', 'approved', 'rejected'] as const;

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

export function AdminOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [orderDetailReady, setOrderDetailReady] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const openOrder = async (order: OrderRow) => {
    setSelectedOrder(order);
    setAdminNote(order.admin_note || '');
    setOrderDetailReady(false);
    if (order.proof_image_path) {
      await preloadImage(order.proof_image_path);
    }
    setOrderDetailReady(true);
  };

  const closeOrder = () => {
    setSelectedOrder(null);
    setOrderDetailReady(false);
  };

  const fetchOrders = async () => {
    try {
      const path = filter === 'all' ? '/admin/orders' : `/admin/orders?status=${filter}`;
      const data = await api.get(path);
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const handleAction = async (status: 'approved' | 'rejected') => {
    if (!selectedOrder) return;
    setActionLoading(true);
    try {
      const actionEndpoint = status === 'approved' ? 'approve' : 'reject';
      await api.post(`/admin/orders/${selectedOrder.id}/${actionEndpoint}`, { admin_note: adminNote || null });
      closeOrder();
      fetchOrders();
    } catch (err) {
      console.error(`Failed to ${status} order:`, err);
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return o.payer_name.toLowerCase().includes(s) || o.payer_email.toLowerCase().includes(s);
  });

  if (loading && orders.length === 0) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Orders"
        description="Review payment proofs, approve access, or reject with a note for the student."
      />

      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <AdminSearchInput value={search} onChange={setSearch} placeholder="Search name or email…" />
        <AdminFilterPills options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      <AdminCard>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <AdminEmptyState message="No orders match your filters." />
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="admin-avatar">{o.payer_name.charAt(0).toUpperCase()}</div>
                        <div>
                          <p className="font-semibold text-text">{o.payer_name}</p>
                          <p className="text-xs text-text-muted">{o.payer_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-text-secondary">{o.course?.title || '—'}</td>
                    <td className="font-bold text-text">
                      $
                      {o.amount}
                    </td>
                    <td>
                      <AdminStatusBadge status={o.status} />
                    </td>
                    <td className="text-text-muted text-xs">
                      {new Date(o.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => openOrder(o)}
                        className="admin-btn admin-btn--ghost admin-btn--sm"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <AdminModal
        open={!!selectedOrder}
        onClose={closeOrder}
        title="Order details"
        subtitle={selectedOrder?.course?.title}
        wide
      >
        {selectedOrder && !orderDetailReady && (
          <div className="admin-modal-loading">
            <AdminLoading />
          </div>
        )}
        {selectedOrder && orderDetailReady && (
          <>
            <div className="mb-5">
              <AdminDetailRow label="Student">{selectedOrder.payer_name}</AdminDetailRow>
              <AdminDetailRow label="Email">{selectedOrder.payer_email}</AdminDetailRow>
              {selectedOrder.payer_phone && (
                <AdminDetailRow label="Phone">{selectedOrder.payer_phone}</AdminDetailRow>
              )}
              <AdminDetailRow label="Amount">
                <span className="text-brand font-bold">
                  $
                  {selectedOrder.amount}
                </span>
              </AdminDetailRow>
              <AdminDetailRow label="Status">
                <AdminStatusBadge status={selectedOrder.status} />
              </AdminDetailRow>
            </div>

            {selectedOrder.proof_image_path ? (
              <div className="mb-5">
                <AdminFieldLabel>Payment proof</AdminFieldLabel>
                <div className="mt-2 rounded-xl border border-border bg-bg-soft overflow-hidden">
                  <img
                    src={selectedOrder.proof_image_path}
                    alt="Payment proof"
                    className="w-full max-h-[360px] object-contain"
                    decoding="sync"
                  />
                </div>
              </div>
            ) : (
              <div className="mb-5 p-8 rounded-xl bg-bg-soft border border-dashed border-border text-center">
                <ImageIcon className="w-10 h-10 text-text-muted/30 mx-auto mb-2" />
                <p className="text-xs text-text-muted">No proof image uploaded</p>
              </div>
            )}

            <div className="mb-5">
              <AdminFieldLabel>Admin note</AdminFieldLabel>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Visible to student if rejected…"
                rows={2}
                className="admin-input admin-input--textarea mt-1.5"
              />
            </div>

            {selectedOrder.status === 'pending' ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  className="admin-btn admin-btn--success flex-1"
                  onClick={() => handleAction('approved')}
                  disabled={actionLoading}
                >
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn--danger flex-1"
                  onClick={() => handleAction('rejected')}
                  disabled={actionLoading}
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            ) : (
              <p className="text-center text-sm text-text-muted py-2">
                This order was already {selectedOrder.status}.
              </p>
            )}
          </>
        )}
      </AdminModal>
    </div>
  );
}
