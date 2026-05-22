import { motion } from 'framer-motion';
import { BookOpen, RefreshCw } from 'lucide-react';
import type { Course } from '../../data/courses';
import { LandingCourseCard } from '../ui/LandingCourseCard';
import { GlowButton } from '../ui/GlowButton';

interface CoursesSectionProps {
  courses: Course[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  selectedCourse: string;
  onSelectCourse: (id: string) => void;
  onBuyClick: (courseId: string) => void;
}

export function CoursesSection({
  courses,
  loading,
  error,
  onRetry,
  selectedCourse,
  onSelectCourse,
  onBuyClick,
}: CoursesSectionProps) {
  const featured = courses.find((c) => c.id === selectedCourse) || courses[0];
  const others = courses.filter((c) => c.id !== featured?.id);

  return (
    <section id="courses" className="relative section-padding overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading font-extrabold text-3xl md:text-[2.75rem] text-text leading-[1.1] max-w-xl">
              Courses built to help you <span className="gradient-text">pass</span>
            </h2>
            <p className="mt-4 text-text-secondary max-w-md leading-relaxed">
              Expert-led, exam-focused programmes for UK pharmacy students. Pick your path — we handle the structure.
            </p>
          </motion.div>
          {!loading && courses.length > 0 && (
            <GlowButton variant="secondary" onClick={() => onBuyClick(featured?.id || courses[0].id)}>
              View all & enroll
            </GlowButton>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-[3px] border-brand border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-text-muted">Loading courses…</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-20 rounded-3xl bg-white border border-red-100 px-6" role="alert">
            <p className="font-heading font-bold text-lg text-text mb-2">Couldn&apos;t load courses</p>
            <p className="text-sm text-text-muted mb-6 max-w-sm mx-auto">{error}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand text-white text-sm font-bold"
              >
                <RefreshCw className="w-4 h-4" /> Try again
              </button>
            )}
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-20 rounded-3xl bg-white border border-dashed border-border">
            <BookOpen className="w-14 h-14 text-text-muted/25 mx-auto mb-4" />
            <h3 className="font-heading font-bold text-lg text-text">New courses coming soon</h3>
            <p className="text-sm text-text-muted mt-2">Check back shortly — we&apos;re preparing something great.</p>
          </div>
        )}

        {!loading && !error && featured && (
          <div className="space-y-8">
            <LandingCourseCard
              course={featured}
              featured
              onBuy={(id) => {
                onSelectCourse(id);
                onBuyClick(id);
              }}
            />
            {others.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {others.map((course, i) => (
                  <div
                    key={course.id}
                    onMouseEnter={() => onSelectCourse(course.id)}
                    onFocus={() => onSelectCourse(course.id)}
                  >
                    <LandingCourseCard
                      course={course}
                      index={i}
                      onBuy={(id) => {
                        onSelectCourse(id);
                        onBuyClick(id);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
