import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, CheckCircle, XCircle, Clock, Eye, Image } from 'lucide-react';
import { api } from '../../lib/api';

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

export function AdminOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

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

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleAction = async (status: 'approved' | 'rejected') => {
    if (!selectedOrder) return;
    setActionLoading(true);
    try {
      const actionEndpoint = status === 'approved' ? 'approve' : 'reject';
      await api.post(`/admin/orders/${selectedOrder.id}/${actionEndpoint}`, { admin_note: adminNote || null });
      setSelectedOrder(null);
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

  const statusBadge = (status: string) => {
    const map: Record<string, { color: string; icon: React.ReactNode }> = {
      pending: { color: 'bg-yellow-50 text-yellow-600 border-yellow-200', icon: <Clock className="w-3 h-3" /> },
      approved: { color: 'bg-green-50 text-success border-green-200', icon: <CheckCircle className="w-3 h-3" /> },
      rejected: { color: 'bg-red-50 text-red-500 border-red-200', icon: <XCircle className="w-3 h-3" /> },
    };
    const cfg = map[status] || map.pending;
    return <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize ${cfg.color}`}>{cfg.icon}{status}</span>;
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-text mb-1">Orders</h1>
      <p className="text-sm text-text-muted mb-6">Manage and review student payment submissions.</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-text focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10" />
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-border rounded-xl p-1">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3.5 py-2 rounded-lg text-xs font-semibold capitalize cursor-pointer border-none transition-all ${filter === f ? 'bg-brand text-white' : 'bg-transparent text-text-secondary hover:bg-bg-soft'}`}>{f}</button>
          ))}
        </div>
      </div>

      {/* Orders table */}
      <div className="rounded-2xl bg-white border border-border card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-bg-soft">
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Student</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Course</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Amount</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Date</th>
                <th className="px-5 py-3 text-xs font-semibold text-text-muted">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-text-muted">No orders found.</td></tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-bg-soft/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-text">{o.payer_name}</p>
                      <p className="text-xs text-text-muted">{o.payer_email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-text-secondary">{o.course?.title || '—'}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-text">{o.course?.currency || '£'}{o.amount}</td>
                    <td className="px-5 py-3.5">{statusBadge(o.status)}</td>
                    <td className="px-5 py-3.5 text-xs text-text-muted">{new Date(o.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => { setSelectedOrder(o); setAdminNote(o.admin_note || ''); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand hover:bg-brand-lighter transition-colors cursor-pointer bg-transparent border-none"><Eye className="w-3.5 h-3.5" /> View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} className="fixed inset-0 z-[51] flex items-center justify-center p-4 pointer-events-none">
              <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar rounded-3xl bg-white border border-border p-6 shadow-2xl pointer-events-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading font-bold text-lg text-text">Order Details</h3>
                <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 rounded-full bg-bg-muted flex items-center justify-center text-text-muted hover:text-text cursor-pointer border-none"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm"><span className="text-text-muted">Student</span><span className="font-semibold text-text">{selectedOrder.payer_name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-muted">Email</span><span className="text-text">{selectedOrder.payer_email}</span></div>
                {selectedOrder.payer_phone && <div className="flex justify-between text-sm"><span className="text-text-muted">Phone</span><span className="text-text">{selectedOrder.payer_phone}</span></div>}
                <div className="flex justify-between text-sm"><span className="text-text-muted">Course</span><span className="font-semibold text-text">{selectedOrder.course?.title}</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-muted">Amount</span><span className="font-bold text-brand">{selectedOrder.course?.currency || '£'}{selectedOrder.amount}</span></div>
                <div className="flex justify-between text-sm items-center"><span className="text-text-muted">Status</span>{statusBadge(selectedOrder.status)}</div>
              </div>
              {/* Proof image */}
              {selectedOrder.proof_image_path ? (
                <div className="mb-5 flex flex-col">
                  <p className="text-xs font-semibold text-text mb-2">Payment Proof</p>
                  <div className="relative w-full rounded-xl border border-border bg-bg-soft overflow-hidden min-h-[200px] flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-brand/30 border-t-brand rounded-full animate-spin"></div>
                    </div>
                    <img src={selectedOrder.proof_image_path} alt="Payment proof" className="relative z-10 w-full max-h-[400px] object-contain" />
                  </div>
                </div>
              ) : (
                <div className="mb-5 p-4 rounded-xl bg-bg-soft border border-border text-center"><Image className="w-8 h-8 text-text-muted/30 mx-auto mb-1" /><p className="text-xs text-text-muted">No proof image uploaded</p></div>
              )}
              {/* Admin note */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-text mb-1.5 block">Admin Note</label>
                <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="Add a note (visible to student if rejected)..." rows={2} className="w-full px-4 py-3 rounded-xl border border-border bg-bg-soft text-sm text-text resize-none focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10" />
              </div>
              {/* Actions */}
              {selectedOrder.status === 'pending' ? (
                <div className="flex gap-3">
                  <button onClick={() => handleAction('approved')} disabled={actionLoading} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-success text-white font-bold text-sm hover:bg-green-600 transition-colors cursor-pointer disabled:opacity-50"><CheckCircle className="w-4 h-4" /> Approve</button>
                  <button onClick={() => handleAction('rejected')} disabled={actionLoading} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"><XCircle className="w-4 h-4" /> Reject</button>
                </div>
              ) : (
                <p className="text-center text-sm text-text-muted">This order has already been {selectedOrder.status}.</p>
              )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
