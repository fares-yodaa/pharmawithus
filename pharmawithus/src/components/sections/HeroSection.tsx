import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Play } from 'lucide-react';
import { GlowButton } from '../ui/GlowButton';
import { HERO_ILLUSTRATION_SRC } from '../../lib/brand';

interface HeroSectionProps {
  onGetAccess: () => void;
}

const SUPPORT_ITEMS = [
  'Topic Explanations',
  'Exam Revision',
  'Past Papers',
  'Clinical Cases',
  'Assignments',
  'One-to-One',
  'Study Resources',
  'Crash Courses',
];

export function HeroSection({ onGetAccess }: HeroSectionProps) {
  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center pt-20 pb-16 overflow-x-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 w-full">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          <div className="lg:col-span-6 text-center lg:text-left min-w-0">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] font-bold uppercase tracking-[0.22em] text-teal"
            >
              PharmaWithUs
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-3 font-heading font-extrabold text-brand uppercase leading-[1.08] tracking-tight text-[2rem] sm:text-4xl md:text-[2.75rem]"
            >
              MPharm Course Support
            </motion.h1>
            <div className="mt-3 mx-auto lg:mx-0 w-16 h-1 rounded-full bg-brand" />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mt-5 text-base md:text-lg text-text max-w-md mx-auto lg:mx-0 leading-relaxed"
            >
              All the support you need to succeed in your MPharm journey.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.18 }}
              className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5 max-w-md mx-auto lg:mx-0 text-left"
            >
              {SUPPORT_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm font-semibold text-text">
                  <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                  {item}
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
              className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3"
            >
              <GlowButton size="lg" onClick={onGetAccess}>
                Explore courses <ArrowRight className="w-5 h-5" />
              </GlowButton>
              <GlowButton
                variant="secondary"
                size="lg"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Play className="w-4 h-4" /> How it works
              </GlowButton>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="lg:col-span-6 flex justify-center lg:justify-end"
          >
            <img
              src={HERO_ILLUSTRATION_SRC}
              alt="Students learning with live video lessons and a study checklist"
              className="w-full max-w-[540px] h-auto object-contain drop-shadow-[0_24px_40px_rgba(233,30,123,0.12)]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
