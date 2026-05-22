import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, CheckCircle2 } from 'lucide-react';
import { GlowButton } from '../ui/GlowButton';
import { AnimatedCounter } from '../ui/AnimatedCounter';

interface HeroSectionProps {
  onGetAccess: () => void;
}

export function HeroSection({ onGetAccess }: HeroSectionProps) {
  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center pt-20 pb-16 overflow-x-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Copy */}
          <div className="lg:col-span-7 text-center lg:text-left min-w-0">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="hero-title font-heading font-extrabold text-text mx-auto lg:mx-0"
            >
              <span className="hero-title__line">Pass your pharmacy exams with</span>
              <span className="hero-title__line">
                <span className="hero-title__accent">structure</span>, not stress.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mt-5 text-base md:text-lg text-text-secondary max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Live classes, exam-focused notes, and mock papers built for UK pharmacy students — so you walk in prepared, not panicking.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3"
            >
              <GlowButton size="lg" onClick={onGetAccess}>
                Explore courses <ArrowRight className="w-5 h-5" />
              </GlowButton>
              <GlowButton variant="secondary" size="lg" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                <Play className="w-4 h-4" /> How it works
              </GlowButton>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-8 flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-text-secondary"
            >
              {['Expert-led content', 'Bank transfer', 'Access after verification'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                  {t}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Visual stack */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="lg:col-span-5 relative overflow-visible"
          >
            <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[360px] lg:max-w-none lg:py-5 lg:px-5">
              {/* Main card */}
              <div className="relative rounded-[2rem] overflow-hidden border border-white/60 shadow-[0_24px_80px_rgba(12,12,20,0.12)] bg-gradient-to-br from-[#1a1035] via-[#2d1b69] to-brand p-8 sm:p-9 text-white">
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand/40 rounded-full blur-3xl pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-pink-200" />
                    <span className="text-xs font-bold uppercase tracking-widest text-white/60">Your exam readiness</span>
                  </div>
                  <div className="flex items-end gap-3">
                    <span className="font-heading font-black text-7xl sm:text-8xl leading-none">94</span>
                    <span className="text-3xl font-bold text-white/80 pb-2">%</span>
                  </div>
                  <p className="text-white/70 text-sm mt-2 font-medium">Average pass rate across our cohort</p>
                  <div className="mt-8 h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-white to-pink-200"
                      initial={{ width: 0 }}
                      animate={{ width: '94%' }}
                      transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>

              {/* Stat pills — sit outside the card, not over the 94% */}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 lg:mt-0 lg:grid-cols-1 lg:gap-0 lg:block">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="px-4 py-3 rounded-2xl bg-white border border-border shadow-lg lg:absolute lg:-top-3 lg:-left-3 lg:max-w-[9.5rem] z-10"
                >
                  <p className="font-heading font-extrabold text-xl sm:text-2xl text-text leading-none">
                    <AnimatedCounter end={2847} suffix="+" />
                  </p>
                  <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wide mt-0.5">Students</p>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="px-4 py-3 rounded-2xl bg-brand text-white shadow-lg pink-glow lg:absolute lg:-bottom-3 lg:-right-3 lg:max-w-[11rem] z-10"
                >
                  <p className="font-heading font-bold text-sm leading-snug">Mock exams included</p>
                  <p className="text-[10px] text-white/80 mt-0.5 leading-snug">Practice like the real thing</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
