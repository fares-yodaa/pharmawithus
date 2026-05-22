import { motion } from 'framer-motion';
import { Brain, Clock, Layers, AlertCircle } from 'lucide-react';
const pains = [
  { icon: Brain, title: 'Information overload', desc: "You've watched every video — and still don't feel ready." },
  { icon: Clock, title: 'Running out of time', desc: 'The exam is close. Panic makes every hour feel wasted.' },
  { icon: Layers, title: "Nothing sticks", desc: 'Formulas and interactions blur together after long cram sessions.' },
  { icon: AlertCircle, title: 'Fear of failing again', desc: 'Another resit costs time, money, and confidence you cannot spare.' },
];

export function PainSection() {
  return (
    <section id="pain" className="section-padding bg-bg-soft border-y border-border/60">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-text leading-tight">
              Studying harder isn&apos;t the answer.{' '}
              <span className="text-brand">Studying smarter is.</span>
            </h2>
            <p className="mt-4 text-text-secondary leading-relaxed">
              Most students don&apos;t fail from lack of effort — they fail from scattered resources and no clear path. We built PharmaWithUs to fix exactly that.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {pains.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-5 rounded-2xl bg-white border border-border card-shadow hover:border-brand/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-lighter flex items-center justify-center text-brand mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-sm text-text mb-1">{title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
