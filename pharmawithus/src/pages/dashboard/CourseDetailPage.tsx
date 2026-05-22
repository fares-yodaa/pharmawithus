import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { PlayCircle, BookOpen, ListVideo } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../../lib/api';
import { getErrorMessage, LOAD_ERROR_COPY } from '../../lib/errors';
import {
  UserLoading,
  UserPageError,
  UserEmptyState,
  UserPageHeader,
} from '../../components/dashboard/user-ui';

interface Lesson {
  id: string;
  title: string;
  video_url: string | null;
  order_index: number;
}

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.get(`/users/courses/${courseId}/lessons`, { silent: true });
      const sorted = [...data].sort((a: Lesson, b: Lesson) => a.order_index - b.order_index);
      setLessons(sorted);
      setActiveLesson(sorted[0] ?? null);
    } catch (err) {
      setError(getErrorMessage(err, LOAD_ERROR_COPY.lessons));
    } finally {
      setLoading(false);
    }
  }, [courseId]);

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
        eyebrow="Now playing"
        title="Course lessons"
        description={
          lessons.length > 0
            ? `${lessons.length} lesson${lessons.length === 1 ? '' : 's'} — select one to watch.`
            : 'Lessons will appear here when published.'
        }
      />

      {lessons.length === 0 ? (
        <UserEmptyState
          icon={<BookOpen className="w-7 h-7" />}
          title="No lessons yet"
          description="This course is being prepared. You'll be notified when new lessons are available."
        />
      ) : (
        <div className="user-video-layout">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="user-video-player"
          >
            {activeLesson?.video_url ? (
              <video
                key={activeLesson.id}
                src={activeLesson.video_url}
                controls
                className="w-full h-full"
                playsInline
              />
            ) : (
              <p className="text-white/60 text-sm flex items-center gap-2 px-4">
                <PlayCircle className="w-6 h-6" />
                {activeLesson ? 'Video coming soon for this lesson' : 'Select a lesson to start'}
              </p>
            )}
          </motion.div>

          <aside>
            <div className="flex items-center gap-2 mb-3 px-1">
              <ListVideo className="w-4 h-4 text-brand" />
              <span className="text-xs font-bold uppercase tracking-wide text-text-muted">
                Playlist
              </span>
            </div>
            <ul className="user-lesson-list space-y-1">
              {lessons.map((lesson, i) => {
                const active = activeLesson?.id === lesson.id;
                return (
                  <li key={lesson.id}>
                    <button
                      type="button"
                      onClick={() => setActiveLesson(lesson)}
                      className={`user-lesson-item ${active ? 'user-lesson-item--active' : ''}`}
                    >
                      <span className="user-lesson-item__num">{i + 1}</span>
                      <span className="line-clamp-2">{lesson.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      )}
    </div>
  );
}
