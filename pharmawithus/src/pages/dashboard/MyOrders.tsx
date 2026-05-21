import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';

interface OrderRow {
  id: string;
  status: string;
  payer_name: string | null;
  amount: number | null;
  admin_note: string | null;
  created_at: string;
  course: { title: string; currency: string } | null;
}

export function MyOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/users/my-orders')
      .then((data) => setOrders(data ?? []))
      .catch((err) => console.error('Failed to fetch orders:', err))
      .finally(() => setLoading(false));
  }, []);

  const statusConfig: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
    pending:  { icon: <Clock className="w-3.5 h-3.5" />,       color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200',  label: 'Pending'  },
    approved: { icon: <CheckCircle className="w-3.5 h-3.5" />, color: 'text-success',    bg: 'bg-green-50 border-green-200',    label: 'Approved' },
    rejected: { icon: <XCircle className="w-3.5 h-3.5" />,     color: 'text-red-500',    bg: 'bg-red-50 border-red-200',        label: 'Rejected' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-text mb-1">My Orders</h1>
      <p className="text-sm text-text-muted mb-8">Track the status of your course purchases.</p>

      {orders.length === 0 ? (
        <div className="text-center py-16 rounded-3xl bg-white border border-border card-shadow">
          <AlertCircle className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
          <h3 className="font-heading font-bold text-lg text-text mb-2">No orders yet</h3>
          <p className="text-sm text-text-muted">Your purchases will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o, i) => {
            const sc = statusConfig[o.status] || statusConfig.pending;
            return (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl bg-white border border-border p-5 card-shadow"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-heading font-bold text-sm text-text truncate">
                      {o.course?.title || 'Course'}
                    </h4>
                    <p className="text-xs text-text-muted mt-0.5">
                      {new Date(o.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <p className="font-heading font-bold text-base text-text shrink-0">
                    {o.course?.currency || '£'}{o.amount ?? '—'}
                  </p>
                  <span
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${sc.bg} ${sc.color}`}
                  >
                    {sc.icon} {sc.label}
                  </span>
                </div>
                {o.status === 'rejected' && o.admin_note && (
                  <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600">
                    <strong>Note:</strong> {o.admin_note}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
