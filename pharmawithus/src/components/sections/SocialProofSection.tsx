import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { TestimonialCard } from '../ui/TestimonialCard';
import { testimonials } from '../../data/testimonials';
import { AnimatedCounter } from '../ui/AnimatedCounter';
export function SocialProofSection() {
  const hero = testimonials[0];

  return (
    <section id="testimonials" className="section-padding relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-text">Loved by pharmacy students</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-5 gap-6 mb-12"
        >
          <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-ink to-ink-soft p-8 text-white flex flex-col justify-between min-h-[280px]">
            <Quote className="w-10 h-10 text-brand/80" />
            <p className="text-lg leading-relaxed text-white/90 mt-4">&ldquo;{hero.quote}&rdquo;</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center font-bold text-sm">
                {hero.avatar}
              </div>
              <div>
                <p className="font-semibold text-sm">{hero.name}</p>
                <p className="text-xs text-white/50">{hero.university}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-3 gap-4">
            {[
              { end: 4, suffix: '.9', label: 'Avg rating', sub: <div className="flex gap-0.5 justify-center mt-1">{[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-brand text-brand" />)}</div> },
              { end: 2847, suffix: '+', label: 'Students', sub: null },
              { end: 94, suffix: '%', label: 'Pass rate', sub: null },
            ].map((stat, i) => (
              <div key={i} className="rounded-2xl bg-white border border-border p-6 text-center card-shadow flex flex-col justify-center">
                <p className="font-heading font-extrabold text-3xl text-text">
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                </p>
                {stat.sub}
                <p className="text-xs text-text-muted mt-2 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.slice(1).map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
