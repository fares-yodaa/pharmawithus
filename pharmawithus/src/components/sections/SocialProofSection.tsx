import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { TestimonialCard } from '../ui/TestimonialCard';
import { testimonials } from '../../data/testimonials';
import { AnimatedCounter } from '../ui/AnimatedCounter';

export function SocialProofSection() {
  return (
    <section id="testimonials" className="section-padding bg-bg-soft">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-text">Loved by Students</h2>
          <p className="mt-3 text-text-secondary">Here's what real students are saying about PharmaWithUs.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-wrap items-center justify-center gap-8 mb-10 py-5 rounded-2xl bg-white border border-border card-shadow">
          <div className="text-center px-6"><div className="font-heading font-extrabold text-3xl text-text"><AnimatedCounter end={4} suffix=".9" /></div><div className="flex items-center justify-center gap-0.5 mt-1">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className="w-3.5 h-3.5 fill-brand text-brand" />))}</div><p className="text-xs text-text-muted mt-1">Average Rating</p></div>
          <div className="w-px h-12 bg-border hidden sm:block" />
          <div className="text-center px-6"><div className="font-heading font-extrabold text-3xl text-text"><AnimatedCounter end={2847} suffix="+" /></div><p className="text-xs text-text-muted mt-1">Students Enrolled</p></div>
          <div className="w-px h-12 bg-border hidden sm:block" />
          <div className="text-center px-6"><div className="font-heading font-extrabold text-3xl text-text"><AnimatedCounter end={94} suffix="%" /></div><p className="text-xs text-text-muted mt-1">Pass Rate</p></div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{testimonials.map((t, i) => (<TestimonialCard key={t.id} testimonial={t} index={i} />))}</div>
      </div>
    </section>
  );
}
