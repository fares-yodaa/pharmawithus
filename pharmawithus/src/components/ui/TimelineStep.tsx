import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface TimelineStepProps {
  step: number;
  title: string;
  description: string;
  icon: ReactNode;
  isLast?: boolean;
  index: number;
}

export function TimelineStep({ step, title, description, icon, isLast = false, index }: TimelineStepProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15, duration: 0.5 }} className="relative flex gap-6 pb-10">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center text-white font-heading font-bold text-sm shadow-md pink-glow shrink-0">{icon}</div>
        {!isLast && (
          <motion.div initial={{ height: 0 }} whileInView={{ height: '100%' }} viewport={{ once: true }} transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }} className="w-[2px] flex-1 bg-brand/20 mt-3" />
        )}
      </div>
      <div className="pt-1 pb-2">
        <span className="text-xs font-bold text-brand uppercase tracking-wider">Step {step}</span>
        <h3 className="font-heading font-bold text-lg text-text mt-1">{title}</h3>
        <p className="text-sm text-text-secondary mt-1 leading-relaxed max-w-sm">{description}</p>
      </div>
    </motion.div>
  );
}
