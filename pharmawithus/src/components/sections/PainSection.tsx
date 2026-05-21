import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Brain, BookX } from 'lucide-react';

export function PainSection() {
  const painPoints = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Information Overload',
      description: "You've watched every YouTube video, read every textbook chapter — and you still don't feel ready.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Running Out of Time',
      description: "Your exam is approaching fast. There aren't enough hours in the day, and panic is setting in.",
    },
    {
      icon: <BookX className="w-6 h-6" />,
      title: 'Nothing Sticks',
      description: "You study for hours but can't retain anything. Formulas, drug interactions — it all blurs together.",
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: 'Fear of Failing',
      description: "The thought of failing keeps you up at night. Another resit means more time, money, and stress.",
    },
  ];

  return (
    <section id="pain" className="relative section-padding">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight via-surface/50 to-midnight pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider mb-5">
            Sound Familiar?
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-text-primary leading-tight">
            You've tried <span className="text-red-400">everything.</span>
          </h2>
          <p className="mt-4 text-text-secondary max-w-xl mx-auto text-lg">
            Notes. Videos. Cramming at 3am. But nothing seems to work — and the exam is getting closer.
          </p>
        </motion.div>

        {/* Pain point cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative p-6 rounded-2xl bg-surface/50 border border-border-subtle hover:border-red-500/20 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 shrink-0 group-hover:bg-red-500/20 transition-colors">
                  {point.icon}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-text-primary mb-1">{point.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{point.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Transition to solution */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <div className="w-px h-16 bg-gradient-to-b from-red-500/40 to-accent-pink/40 mx-auto mb-6" />
          <p className="font-heading font-bold text-xl md:text-2xl text-text-primary">
            What if there was a <span className="gradient-text">better way?</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
