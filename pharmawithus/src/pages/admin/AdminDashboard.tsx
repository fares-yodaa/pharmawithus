import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, CheckCircle, DollarSign } from 'lucide-react';
import { api } from '../../lib/api';

interface Stats {
  totalOrders: number;
  pending: number;
  approved: number;
  rejected: number;
  totalRevenue: number;
}

interface RecentOrder {
  id: string;
  payer_name: string | null;
  payer_email: string | null;
  status: string;
  amount: number | null;
  created_at: string;
  course: { title: string; currency: string } | null;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, pending: 0, approved: 0, rejected: 0, totalRevenue: 0 });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/orders')
      .then((orders: RecentOrder[]) => {
        setStats({
          totalOrders: orders.length,
          pending:  orders.filter((o) => o.status === 'pending').length,
          approved: orders.filter((o) => o.status === 'approved').length,
          rejected: orders.filter((o) => o.status === 'rejected').length,
          totalRevenue: orders
            .filter((o) => o.status === 'approved')
            .reduce((sum, o) => sum + Number(o.amount ?? 0), 0),
        });
        // Show only the 8 most recent
        setRecentOrders(orders.slice(0, 8));
      })
      .catch((err) => console.error('Failed to load dashboard stats:', err))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders,    icon: <ShoppingBag className="w-5 h-5" />, color: 'text-brand',       bg: 'bg-brand-lighter' },
    { label: 'Pending',      value: stats.pending,         icon: <Clock className="w-5 h-5" />,        color: 'text-yellow-600', bg: 'bg-yellow-50'     },
    { label: 'Approved',     value: stats.approved,        icon: <CheckCircle className="w-5 h-5" />,  color: 'text-success',    bg: 'bg-green-50'      },
    { label: 'Revenue',      value: `£${stats.totalRevenue}`, icon: <DollarSign className="w-5 h-5" />, color: 'text-brand',    bg: 'bg-brand-lighter' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-text mb-1">Dashboard</h1>
      <p className="text-sm text-text-muted mb-8">Overview of your platform activity.</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl bg-white border border-border p-5 card-shadow"
          >
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color} mb-3`}>
              {s.icon}
            </div>
            <p className="font-heading font-extrabold text-2xl text-text">{s.value}</p>
            <p className="text-xs text-text-muted mt-0.5 font-medium">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Pending alert */}
      {stats.pending > 0 && (
        <div className="mb-6 flex items-center gap-3 p-4 rounded-2xl bg-yellow-50 border border-yellow-200">
          <Clock className="w-5 h-5 text-yellow-600 shrink-0" />
          <p className="text-sm text-yellow-700 font-medium">
            {stats.pending} order{stats.pending > 1 ? 's' : ''} awaiting your review
          </p>
          <Link to="/admin/orders" className="ml-auto text-sm font-bold text-yellow-700 hover:underline">
            Review now
          </Link>
        </div>
      )}

      {/* Recent orders */}
      <div className="rounded-2xl bg-white border border-border card-shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-heading font-bold text-base text-text">Recent Orders</h3>
          <Link to="/admin/orders" className="text-xs font-semibold text-brand hover:underline">View All</Link>
        </div>
        <div className="divide-y divide-border">
          {recentOrders.length === 0 ? (
            <p className="p-5 text-sm text-text-muted text-center">No orders yet.</p>
          ) : (
            recentOrders.map((o) => {
              const statusColors: Record<string, string> = {
                pending:  'bg-yellow-50 text-yellow-600 border-yellow-200',
                approved: 'bg-green-50 text-success border-green-200',
                rejected: 'bg-red-50 text-red-500 border-red-200',
              };
              return (
                <div key={o.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-bg-soft transition-colors">
                  <div className="w-8 h-8 rounded-full bg-brand-lighter flex items-center justify-center text-brand text-xs font-bold shrink-0">
                    {(o.payer_name ?? '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text truncate">{o.payer_name ?? '—'}</p>
                    <p className="text-xs text-text-muted truncate">{o.course?.title}</p>
                  </div>
                  <p className="text-sm font-bold text-text shrink-0">
                    {o.course?.currency || '£'}{o.amount ?? '—'}
                  </p>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize ${statusColors[o.status] || ''}`}>
                    {o.status}
                  </span>
                  <p className="text-xs text-text-muted shrink-0 hidden sm:block">
                    {new Date(o.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
