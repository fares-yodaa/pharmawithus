import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle, Users, Award, BookOpen } from 'lucide-react';
import { GlowButton } from '../ui/GlowButton';
import { AnimatedCounter } from '../ui/AnimatedCounter';

interface HeroSectionProps {
  onGetAccess: () => void;
}

/* Mortar & Pestle SVG — brand icon */
function MortarIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 28C20 28 18 14 32 14C46 14 44 28 44 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M38 14L44 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="32" cy="30" rx="16" ry="4" fill="currentColor" opacity="0.15" />
      <path d="M16 30C16 30 14 50 32 50C50 50 48 30 48 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M16 30H48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M26 50L24 56H40L38 50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 56H44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function HeroSection({ onGetAccess }: HeroSectionProps) {
  return (
    <section id="hero" className="relative pt-24 pb-8 md:pt-28 md:pb-12 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-lighter via-white to-pink-50 pointer-events-none" />
      {/* Decorative circles */}
      <div className="absolute top-20 right-[10%] w-64 h-64 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-[5%] w-48 h-48 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6">


        {/* Main headline — large, bold, no emoji */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center max-w-4xl mx-auto">
          <h1 className="font-heading font-extrabold text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-text">
            The Smartest Way to
            <br />
            <span className="relative">
              <span className="gradient-text">Pass Your Pharmacy Exams</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 8C50 2 100 2 150 6C200 10 250 4 298 8" stroke="#E91E7B" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
              </svg>
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Structured live classes, expert-led notes, and exam-focused preparation that has helped thousands of students pass with confidence.
          </p>
        </motion.div>

        {/* CTA row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <GlowButton size="lg" onClick={onGetAccess}>
            Browse Courses <ArrowRight className="w-5 h-5" />
          </GlowButton>
          <GlowButton variant="secondary" size="lg" onClick={onGetAccess}>
            <Play className="w-4 h-4" /> See How It Works
          </GlowButton>
        </motion.div>

        {/* Bento grid — stats + product preview */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {/* Large card — Interactive Mastery */}
          <div className="col-span-2 row-span-2 rounded-3xl relative overflow-hidden p-6 md:p-8 card-shadow group hover:card-shadow-hover transition-shadow bg-gradient-to-br from-[#2D1B69] via-[#482069] to-[#E91E7B] text-white">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-heading font-extrabold text-2xl tracking-tight">Interactive Mastery</h3>
                  <p className="text-white/70 text-sm mt-1">AI-driven prep tailored to you</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Play className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center relative">
                {/* Background glow for the circle */}
                <div className="absolute w-40 h-40 bg-[#E91E7B] rounded-full blur-[60px] opacity-50 animate-pulse"></div>

                {/* Circular Progress Ring */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#progress-gradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "283", strokeDashoffset: "283" }}
                      animate={{ strokeDashoffset: "14" }}
                      transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                    />
                    <defs>
                      <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fff" />
                        <stop offset="100%" stopColor="#FFB3D9" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.5, type: "spring" }}
                      className="text-4xl font-heading font-black"
                    >
                      95<span className="text-xl">%</span>
                    </motion.span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-white/60 mt-1">Ready</span>
                  </div>
                </div>

                {/* Floating Glassmorphism Badge 1 */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: [0, -8, 0], opacity: 1 }}
                  transition={{ 
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    opacity: { duration: 0.8, delay: 0.8 }
                  }}
                  className="absolute -left-2 top-8 md:-left-6 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center gap-2 shadow-xl"
                >
                  <div className="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-green-300" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/60 uppercase font-bold tracking-wider leading-none">Mock Exam</span>
                    <span className="text-sm font-bold text-white leading-tight">Passed</span>
                  </div>
                </motion.div>

                {/* Floating Glassmorphism Badge 2 */}
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: [0, 8, 0], opacity: 1 }}
                  transition={{ 
                    y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
                    opacity: { duration: 0.8, delay: 1.2 }
                  }}
                  className="absolute -right-2 bottom-8 md:-right-6 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center gap-2 shadow-xl"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-400/20 flex items-center justify-center">
                    <BookOpen className="w-3.5 h-3.5 text-blue-300" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/60 uppercase font-bold tracking-wider leading-none">Active Recall</span>
                    <span className="text-sm font-bold text-white leading-tight">Mastered</span>
                  </div>
                </motion.div>

              </div>
            </div>
          </div>

          {/* Stat card — Students */}
          <div className="rounded-3xl bg-white border border-border p-5 card-shadow flex flex-col justify-between hover:card-shadow-hover transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-brand" />
            </div>
            <div>
              <p className="font-heading font-extrabold text-3xl text-text">
                <AnimatedCounter end={2847} suffix="+" />
              </p>
              <p className="text-xs text-text-muted mt-1 font-medium">Students Enrolled</p>
            </div>
          </div>

          {/* Stat card — Pass Rate */}
          <div className="rounded-3xl bg-brand text-white p-5 card-shadow flex flex-col justify-between hover:pink-glow-strong transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-heading font-extrabold text-3xl">
                <AnimatedCounter end={94} suffix="%" />
              </p>
              <p className="text-xs text-white/70 mt-1 font-medium">Pass Rate</p>
            </div>
          </div>

          {/* Stat card — Courses */}
          <div className="rounded-3xl bg-white border border-border p-5 card-shadow flex flex-col justify-between hover:card-shadow-hover transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5 text-brand" />
            </div>
            <div>
              <p className="font-heading font-extrabold text-3xl text-text">
                <AnimatedCounter end={120} suffix="+" />
              </p>
              <p className="text-xs text-text-muted mt-1 font-medium">Lessons Available</p>
            </div>
          </div>

          {/* Brand card — mortar & pestle */}
          <div className="rounded-3xl bg-gradient-to-br from-brand-lighter to-pink-100 border border-brand/10 p-5 card-shadow flex flex-col items-center justify-center text-center hover:card-shadow-hover transition-shadow">
            <MortarIcon className="w-12 h-12 text-brand mb-2" />
            <p className="font-heading font-bold text-sm text-text">PharmaWithUs</p>
            <p className="text-[11px] text-text-muted mt-0.5">Ace with us</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
