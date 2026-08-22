import { motion } from 'framer-motion';
import type { ReactElement } from 'react';
import { Clock, BookOpen, TrendingUp, ShoppingCart } from 'lucide-react';
import type { Course } from '../../data/courses';

interface CourseCardProps {
  course: Course;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onBuy: (id: string) => void;
  index: number;
}

const courseIcons: Record<string, ReactElement> = {
  'pre-reg': (
    <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
      <rect x="8" y="5" width="24" height="30" rx="4" stroke="#E91E7B" strokeWidth="1.8"/>
      <path d="M14 13h12M14 18h12M14 23h8" stroke="#E91E7B" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="28" cy="28" r="6" fill="#E91E7B" fillOpacity="0.12"/>
      <path d="M26 28h4M28 26v4" stroke="#E91E7B" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  'calculations': (
    <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
      <rect x="7" y="5" width="26" height="30" rx="4" stroke="#E91E7B" strokeWidth="1.8"/>
      <rect x="11" y="9" width="18" height="7" rx="2" fill="#E91E7B" fillOpacity="0.12"/>
      <circle cx="15" cy="23" r="2.5" stroke="#E91E7B" strokeWidth="1.3"/>
      <circle cx="25" cy="23" r="2.5" stroke="#E91E7B" strokeWidth="1.3"/>
      <circle cx="15" cy="30" r="2.5" stroke="#E91E7B" strokeWidth="1.3"/>
      <circle cx="25" cy="30" r="2.5" stroke="#E91E7B" strokeWidth="1.3"/>
    </svg>
  ),
  'clinical': (
    <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
      <path d="M20 6v8M17 10h6" stroke="#E91E7B" strokeWidth="1.8" strokeLinecap="round"/>
      <rect x="10" y="14" width="20" height="22" rx="4" stroke="#E91E7B" strokeWidth="1.8"/>
      <path d="M15 21h10M15 26h10M15 31h6" stroke="#E91E7B" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  'bundle': (
    <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9">
      <rect x="5" y="12" width="20" height="24" rx="3" stroke="#E91E7B" strokeWidth="1.5" opacity="0.3"/>
      <rect x="10" y="7" width="20" height="24" rx="3" stroke="#E91E7B" strokeWidth="1.5" opacity="0.6" fill="white"/>
      <rect x="15" y="2" width="20" height="24" rx="3" stroke="#E91E7B" strokeWidth="1.8" fill="white"/>
      <path d="M20 9h10M20 14h10M20 19h6" stroke="#E91E7B" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

export function CourseCard({ course, isSelected, onSelect, onBuy, index }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={`relative flex flex-col rounded-2xl bg-white transition-all duration-300 cursor-pointer group overflow-visible ${
        isSelected
          ? 'border-2 border-brand shadow-[0_8px_30px_rgba(233,30,123,0.15)]'
          : 'border border-border shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-brand/30'
      }`}
      onClick={() => onSelect(course.id)}
      id={`course-card-${course.id}`}
    >
      {/* Badge — sits above the card */}
      {course.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <span className="px-4 py-1.5 rounded-full text-[11px] font-bold font-heading bg-brand text-white tracking-wider uppercase whitespace-nowrap shadow-md">
            {course.badge}
          </span>
        </div>
      )}

      {/* Banner Image */}
      {course.pictureUrl && (
        <div className="w-full h-40 rounded-t-2xl overflow-hidden shrink-0 border-b border-border">
          <img src={course.pictureUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
        </div>
      )}

      <div className={`flex flex-col flex-1 p-6 text-center ${!course.pictureUrl ? 'pt-8' : ''}`}>
        {/* Icon */}
        {!course.pictureUrl && (
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-brand-lighter/70 flex items-center justify-center">
          {courseIcons[course.id] || <BookOpen className="w-8 h-8 text-brand" />}
        </div>
        )}

        {/* Title */}
        <h3 className="font-heading font-bold text-[17px] text-text leading-snug mb-2">{course.title}</h3>

        {/* Description */}
        <p className="text-[13px] text-text-muted leading-relaxed mb-5 flex-1">{course.description}</p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-4 text-[12px] text-text-muted mb-5">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-brand/50" />
            {course.lessonCount} lessons
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand/50" />
            {course.duration}
          </span>
        </div>

        {/* Price */}
        <div className="mb-5">
          <span className="text-[28px] font-heading font-extrabold text-text">${course.price}</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={(e) => { e.stopPropagation(); onBuy(course.id); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-full text-[13px] font-bold bg-brand text-white hover:bg-brand-dark transition-colors cursor-pointer shadow-[0_4px_16px_rgba(233,30,123,0.25)]"
          >
            <ShoppingCart className="w-4 h-4" />
            Buy Now
          </button>
        </div>

        {/* Pass rate */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[12px]">
          <TrendingUp className="w-3.5 h-3.5 text-success" />
          <span className="text-success font-semibold">{course.passRate}% pass rate</span>
        </div>
      </div>
    </motion.div>
  );
}
