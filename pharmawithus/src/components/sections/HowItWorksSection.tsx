import { motion } from 'framer-motion';
import { MousePointerClick, CreditCard, GraduationCap } from 'lucide-react';
const steps = [
  {
    step: '01',
    title: 'Choose your course',
    description: 'Browse our GPhC-aligned programmes, book a drop-in session, or message us for guidance.',
    icon: MousePointerClick,
  },
  {
    step: '02',
    title: 'Pay & submit proof',
    description: 'Pay via bank transfer, upload your receipt, and we verify your order (usually within 24 hours).',
    icon: CreditCard,
  },
  {
    step: '03',
    title: 'Study & pass',
    description: 'Access lessons, notes, and mocks from your dashboard. Walk in on exam day with real confidence.',
    icon: GraduationCap,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-padding relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-text">
            From signup to <span className="gradient-text">exam day</span>
          </h2>
          <p className="mt-3 text-text-secondary max-w-md mx-auto">Three clear steps. No confusion, no hidden hoops.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {steps.map(({ step, title, description, icon: Icon }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-3xl border border-border bg-bg-soft/80 p-8 hover:border-brand/25 hover:card-shadow-hover transition-all group"
            >
              <span className="absolute top-6 right-6 font-heading font-black text-5xl text-brand/10 group-hover:text-brand/15 transition-colors">
                {step}
              </span>
              <div className="w-12 h-12 rounded-2xl bg-brand text-white flex items-center justify-center mb-6 shadow-lg pink-glow">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-text mb-2">{title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 w-8 h-px bg-gradient-to-r from-brand/40 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
