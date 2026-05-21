import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { Testimonial } from '../../data/testimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

export function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="rounded-2xl bg-white border border-border p-5 hover:border-brand/20 hover:card-shadow-hover transition-all duration-300 card-shadow"
      id={`testimonial-${testimonial.id}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-heading font-bold text-sm shrink-0">{testimonial.avatar}</div>
        <div className="flex-1 min-w-0">
          <span className="font-heading font-semibold text-text text-sm">{testimonial.name}</span>
          <p className="text-xs text-text-muted truncate">{testimonial.university}</p>
        </div>
        <div className="text-xs font-bold text-success bg-green-50 px-2 py-1 rounded-full">{testimonial.score}</div>
      </div>
      <div className="flex gap-0.5 mb-2.5">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-brand text-brand" />
        ))}
      </div>
      <p className="text-text-secondary text-sm leading-relaxed">"{testimonial.quote}"</p>
      <div className="mt-3 pt-2.5 border-t border-border">
        <span className="text-xs text-text-muted">Course: <span className="text-brand font-medium">{testimonial.course}</span></span>
      </div>
    </motion.div>
  );
}
