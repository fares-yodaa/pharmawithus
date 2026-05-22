import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, CheckCircle, PoundSterling, ArrowRight } from 'lucide-react';
import { api } from '../../lib/api';
import {
  AdminPageHeader,
  AdminStatCard,
  AdminCard,
  AdminCardHeader,
  AdminLoading,
  AdminStatusBadge,
  AdminEmptyState,
} from '../../components/admin/admin-ui';

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
          pending: orders.filter((o) => o.status === 'pending').length,
          approved: orders.filter((o) => o.status === 'approved').length,
          rejected: orders.filter((o) => o.status === 'rejected').length,
          totalRevenue: orders
            .filter((o) => o.status === 'approved')
            .reduce((sum, o) => sum + Number(o.amount ?? 0), 0),
        });
        setRecentOrders(orders.slice(0, 8));
      })
      .catch((err) => console.error('Failed to load dashboard stats:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="A quick snapshot of orders, revenue, and what needs your attention."
      />

      <div className="grid grid-cols-2 min-[1100px]:grid-cols-4 gap-4 mb-8">
        <AdminStatCard
          label="Total orders"
          value={stats.totalOrders}
          icon={<ShoppingBag className="w-5 h-5" />}
          tone="brand"
          delay={0}
        />
        <AdminStatCard
          label="Pending review"
          value={stats.pending}
          icon={<Clock className="w-5 h-5" />}
          tone="amber"
          delay={0.06}
        />
        <AdminStatCard
          label="Approved"
          value={stats.approved}
          icon={<CheckCircle className="w-5 h-5" />}
          tone="emerald"
          delay={0.12}
        />
        <AdminStatCard
          label="Revenue"
          value={`£${stats.totalRevenue.toLocaleString()}`}
          icon={<PoundSterling className="w-5 h-5" />}
          tone="ink"
          delay={0.18}
        />
      </div>

      {stats.pending > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-alert admin-alert--amber mb-8"
        >
          <Clock className="w-5 h-5 shrink-0" />
          <span className="flex-1">
            {stats.pending} order{stats.pending > 1 ? 's' : ''} waiting for your review
          </span>
          <Link to="/admin/orders" className="inline-flex items-center gap-1 text-brand font-bold hover:underline shrink-0">
            Review <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}

      <AdminCard>
        <AdminCardHeader
          title="Recent orders"
          action={
            <Link to="/admin/orders" className="text-xs font-bold text-brand hover:underline">
              View all
            </Link>
          }
        />
        {recentOrders.length === 0 ? (
          <AdminEmptyState message="No orders yet. They'll show up here when students enroll." />
        ) : (
          <div className="divide-y divide-border">
            {recentOrders.map((o, i) => (
              <motion.div
                key={o.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-brand/[0.03] transition-colors"
              >
                <div className="admin-avatar">{(o.payer_name ?? '?').charAt(0).toUpperCase()}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text truncate">{o.payer_name ?? '—'}</p>
                  <p className="text-xs text-text-muted truncate">{o.course?.title}</p>
                </div>
                <p className="text-sm font-bold text-text shrink-0 hidden sm:block">
                  {o.course?.currency || '£'}
                  {o.amount ?? '—'}
                </p>
                <AdminStatusBadge status={o.status} />
                <p className="text-xs text-text-muted shrink-0 hidden md:block">
                  {new Date(o.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
