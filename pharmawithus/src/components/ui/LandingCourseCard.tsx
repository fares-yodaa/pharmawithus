import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, Sparkles, TrendingUp } from 'lucide-react';
import type { Course } from '../../data/courses';

interface LandingCourseCardProps {
  course: Course;
  featured?: boolean;
  onBuy: (id: string) => void;
  index?: number;
}

export function LandingCourseCard({ course, featured = false, onBuy, index = 0 }: LandingCourseCardProps) {
  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="group relative rounded-[2rem] overflow-hidden border border-border bg-white shadow-[0_20px_60px_rgba(12,12,20,0.08)] hover:shadow-[0_28px_80px_rgba(233,30,123,0.12)] transition-shadow duration-500"
      >
        <div className="grid md:grid-cols-2 min-h-[320px]">
          <div className="relative bg-gradient-to-br from-brand-lighter via-white to-bg-soft p-8 md:p-10 flex flex-col justify-center order-2 md:order-1">
            {course.badge && (
              <span className="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full bg-brand text-white text-[10px] font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3 h-3" /> {course.badge}
              </span>
            )}
            <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-2">{course.subtitle}</p>
            <h3 className="font-heading font-extrabold text-2xl md:text-3xl text-text leading-tight">{course.title}</h3>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed line-clamp-3">{course.description}</p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-text-muted">
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-brand" />{course.lessonCount} lessons</span>
              {course.duration && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-brand" />{course.duration}</span>}
              {course.passRate > 0 && (
                <span className="flex items-center gap-1.5 text-success font-semibold">
                  <TrendingUp className="w-4 h-4" />{course.passRate}% pass rate
                </span>
              )}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div>
                <span className="font-heading font-black text-4xl text-text">${course.price}</span>
              </div>
              <button
                type="button"
                onClick={() => onBuy(course.id)}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-text text-white font-heading font-bold text-sm hover:bg-brand transition-colors shadow-lg"
              >
                Enroll now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="relative min-h-[220px] md:min-h-0 bg-ink order-1 md:order-2 overflow-hidden">
            {course.pictureUrl ? (
              <img src={course.pictureUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1035] via-brand/80 to-pink-400 flex items-center justify-center">
                <BookOpen className="w-20 h-20 text-white/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent md:bg-gradient-to-l md:from-ink/40" />
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="group flex flex-col h-full rounded-2xl border border-border bg-white overflow-hidden hover:border-brand/35 hover:shadow-[0_16px_48px_rgba(233,30,123,0.1)] transition-all duration-300"
    >
      <div className="relative h-44 bg-bg-soft overflow-hidden">
        {course.pictureUrl ? (
          <img src={course.pictureUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-lighter to-white">
            <BookOpen className="w-12 h-12 text-brand/30" />
          </div>
        )}
        {course.badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-brand text-white text-[9px] font-bold uppercase tracking-wide">
            {course.badge}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-5">
        <p className="text-[10px] font-bold text-brand uppercase tracking-wider mb-1">{course.subtitle}</p>
        <h3 className="font-heading font-bold text-base text-text leading-snug line-clamp-2">{course.title}</h3>
        <div className="mt-auto pt-4 flex items-end justify-between gap-2">
          <div>
            <span className="font-heading font-extrabold text-xl text-text">${course.price}</span>
          </div>
          <button
            type="button"
            onClick={() => onBuy(course.id)}
            className="shrink-0 p-2.5 rounded-xl bg-brand text-white hover:bg-brand-dark transition-colors"
            aria-label={`Enroll in ${course.title}`}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
