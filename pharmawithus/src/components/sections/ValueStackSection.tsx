import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export function ValueStackSection() {
  const comparisons = [
    { item: 'Private Tutoring (10 sessions)', otherPrice: '£500', ourPrice: 'Included' },
    { item: 'Textbook Collection', otherPrice: '£120', ourPrice: 'Included' },
    { item: 'Practice Question Bank', otherPrice: '£80', ourPrice: 'Included' },
    { item: 'Mock Exam Papers', otherPrice: '£60', ourPrice: 'Included' },
    { item: 'Study Group Access', otherPrice: '£40/mo', ourPrice: 'Included' },
    { item: 'WhatsApp Expert Support', otherPrice: 'N/A', ourPrice: 'Included' },
  ];

  return (
    <section id="value" className="relative section-padding">
      <div className="absolute inset-0 bg-gradient-to-b from-midnight via-surface/30 to-midnight pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-purple/10 text-accent-purple text-xs font-bold uppercase tracking-wider mb-5">
            The Real Value
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-text-primary leading-tight">
            What Others Charge vs.{' '}
            <span className="gradient-text">What You Pay</span>
          </h2>
          <p className="mt-4 text-text-secondary max-w-xl mx-auto text-lg">
            You'd spend over £800 getting all this separately. Today, it's yours for a fraction of that.
          </p>
        </motion.div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden border border-border-subtle"
        >
          {/* Header */}
          <div className="grid grid-cols-3 bg-surface/80 px-6 py-4 border-b border-border-subtle">
            <span className="text-sm font-heading font-semibold text-text-primary">What's Included</span>
            <span className="text-sm font-heading font-semibold text-text-muted text-center">Others</span>
            <span className="text-sm font-heading font-semibold text-accent-pink text-center">PharmaWithUs</span>
          </div>

          {/* Rows */}
          {comparisons.map((comp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`grid grid-cols-3 px-6 py-4 items-center ${
                i < comparisons.length - 1 ? 'border-b border-border-subtle' : ''
              } hover:bg-white/[0.02] transition-colors`}
            >
              <span className="text-sm text-text-secondary">{comp.item}</span>
              <span className="text-sm text-text-muted text-center flex items-center justify-center gap-1.5">
                <span className="line-through">{comp.otherPrice}</span>
              </span>
              <span className="text-sm text-success text-center font-semibold flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" />
                {comp.ourPrice}
              </span>
            </motion.div>
          ))}

          {/* Total */}
          <div className="grid grid-cols-3 px-6 py-5 bg-gradient-to-r from-accent-pink/5 to-accent-purple/5 border-t border-border-subtle">
            <span className="text-sm font-heading font-bold text-text-primary">Total Value</span>
            <span className="text-sm text-text-muted text-center">
              <span className="line-through">£800+</span>
            </span>
            <div className="text-center">
              <span className="text-2xl font-heading font-extrabold gradient-text">From £19</span>
            </div>
          </div>
        </motion.div>

        {/* Savings callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-success/10 border border-success/20">
            <span className="text-success text-sm font-bold">You save over £750 today</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
