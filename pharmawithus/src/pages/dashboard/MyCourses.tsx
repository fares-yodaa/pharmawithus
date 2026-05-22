import { useState, useEffect, useCallback } from 'react';
import { BookOpen } from 'lucide-react';
import { api } from '../../lib/api';
import { getErrorMessage, LOAD_ERROR_COPY } from '../../lib/errors';
import { useAuth } from '../../context/AuthContext';
import {
  UserLoading,
  UserPageError,
  UserPageHeader,
  UserWelcomeBanner,
  UserEmptyState,
  UserPrimaryButton,
  UserOwnedCourseCard,
} from '../../components/dashboard/user-ui';

export function MyCourses() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [coursesData, ordersData] = await Promise.all([
        api.get('/users/my-courses', { silent: true }),
        api.get('/users/my-orders', { silent: true }).catch(() => []),
      ]);
      setCourses(coursesData ?? []);
      const pending = (ordersData ?? []).filter((o: { status: string }) => o.status === 'pending').length;
      setPendingOrders(pending);
    } catch (err) {
      setError(getErrorMessage(err, LOAD_ERROR_COPY.courses));
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
      <UserWelcomeBanner
        name={profile?.full_name || 'Student'}
        coursesCount={courses.length}
        pendingOrders={pendingOrders}
      />

      <UserPageHeader
        eyebrow="Your library"
        title="My Courses"
        description="Everything you've unlocked — pick up where you left off."
        action={
          courses.length > 0 ? (
            <UserPrimaryButton to="/dashboard/browse" className="!text-xs">
              Browse more
            </UserPrimaryButton>
          ) : undefined
        }
      />

      {courses.length === 0 ? (
        <UserEmptyState
          icon={<BookOpen className="w-7 h-7" />}
          title="No courses yet"
          description="Explore our pharmacy exam prep courses and enroll in minutes. Your purchased courses will show up here."
          action={
            <UserPrimaryButton to="/dashboard/browse">
              Browse courses
            </UserPrimaryButton>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {courses.map((c, i) => (
            <UserOwnedCourseCard key={c.id} course={c} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
