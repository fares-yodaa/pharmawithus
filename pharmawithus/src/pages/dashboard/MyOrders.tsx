import { useState, useEffect, useCallback } from 'react';
import { FileText, ShoppingBag } from 'lucide-react';
import { api } from '../../lib/api';
import { getErrorMessage, LOAD_ERROR_COPY } from '../../lib/errors';
import {
  UserLoading,
  UserPageError,
  UserPageHeader,
  UserEmptyState,
  UserOrderCard,
  UserPrimaryButton,
} from '../../components/dashboard/user-ui';

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
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/users/my-orders', { silent: true });
      setOrders(data ?? []);
    } catch (err) {
      setError(getErrorMessage(err, LOAD_ERROR_COPY.orders));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <UserLoading />;

  if (error) {
    return <UserPageError message={error} onRetry={load} />;
  }

  return (
    <div>
      <UserPageHeader
        eyebrow="Purchases"
        title="My Orders"
        description="Track payment verification and access for each enrollment."
        action={
          orders.length === 0 ? (
            <UserPrimaryButton to="/dashboard/browse" className="!text-xs">
              Browse courses
            </UserPrimaryButton>
          ) : undefined
        }
      />

      {orders.length === 0 ? (
        <UserEmptyState
          icon={<FileText className="w-7 h-7" />}
          title="No orders yet"
          description="When you enroll in a course, your order and status will appear here."
          action={
            <UserPrimaryButton to="/dashboard/browse">
              <ShoppingBag className="w-4 h-4" /> Find a course
            </UserPrimaryButton>
          }
        />
      ) : (
        <div className="space-y-3">
          {orders.map((o, i) => (
            <UserOrderCard key={o.id} order={o} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
