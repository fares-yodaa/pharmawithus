import { motion } from 'framer-motion';
import { CourseCard } from '../ui/CourseCard';
import type { Course } from '../../data/courses';
import { BookOpen } from 'lucide-react';

interface CoursesSectionProps {
  courses: Course[];
  loading: boolean;
  selectedCourse: string;
  onSelectCourse: (id: string) => void;
  onBuyClick: () => void;
}

export function CoursesSection({ courses, loading, selectedCourse, onSelectCourse, onBuyClick }: CoursesSectionProps) {
  return (
    <section id="courses" className="relative section-padding bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-text">
            Courses Built to Help You <span className="text-brand">Pass</span>
          </h2>
          <p className="mt-3 text-text-secondary max-w-lg mx-auto">Choose the right course for your goals</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
            <h3 className="font-heading font-bold text-lg text-text mb-2">No courses available yet</h3>
            <p className="text-sm text-text-muted">Check back later for amazing courses!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {courses.map((course, i) => (
              <CourseCard
                key={course.id}
                course={course}
                isSelected={selectedCourse === course.id}
                onSelect={onSelectCourse}
                onBuy={(id) => { onSelectCourse(id); onBuyClick(); }}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
