import { useState, useEffect, useCallback } from 'react';
import { BookOpen, GraduationCap } from 'lucide-react';
import { api } from '../../lib/api';
import { getErrorMessage, LOAD_ERROR_COPY } from '../../lib/errors';
import {
  UserLoading,
  UserPageError,
  UserPageHeader,
  UserEmptyState,
  UserBrowseCourseCard,
} from '../../components/dashboard/user-ui';

export function BrowseCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/users/courses', { silent: true });
      setCourses(data ?? []);
    } catch (err) {
      setError(getErrorMessage(err, LOAD_ERROR_COPY.browse));
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
      <div className="user-browse-hero">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6 text-brand" />
          </div>
          <div>
            <p className="user-eyebrow">Catalog</p>
            <h2 className="font-heading font-extrabold text-lg text-text mt-1">
              Professional pharmacy courses
            </h2>
            <p className="text-sm text-text-secondary mt-1 max-w-lg leading-relaxed">
              Structured lessons, proven pass rates, and expert content — built to help you succeed on exam day.
            </p>
          </div>
        </div>
      </div>

      <UserPageHeader
        title="Browse Courses"
        description="Choose a course, submit payment proof, and get access once verified."
      />

      {courses.length === 0 ? (
        <UserEmptyState
          icon={<BookOpen className="w-7 h-7" />}
          title="No courses available"
          description="We're preparing new content. Check back soon for fresh courses."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((c, i) => (
            <UserBrowseCourseCard key={c.id} course={c} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
