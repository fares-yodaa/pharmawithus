import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, GraduationCap, TrendingUp } from 'lucide-react';
import { LandingPageBackground } from '../ui/LandingPageBackground';
import { BrandLogo } from './BrandLogo';

const stats = [
  { icon: GraduationCap, value: '2,800+', label: 'Students' },
  { icon: TrendingUp, value: '94%', label: 'Pass rate' },
  { icon: BookOpen, value: 'Expert', label: 'Led content' },
];

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  courseBanner?: string;
  footer?: ReactNode;
}

export function AuthLayout({ children, title, subtitle, courseBanner, footer }: AuthLayoutProps) {
  return (
    <div className="auth-page min-h-screen relative">
      <LandingPageBackground />

      <div className="relative z-10 min-h-screen lg:grid lg:grid-cols-2">
        {/* Brand panel — desktop */}
        <aside className="auth-panel-brand hidden lg:flex flex-col justify-between p-12 xl:p-14">
          <BrandLogo variant="dark" />

          <div className="max-w-md">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-heading font-extrabold text-3xl xl:text-4xl text-white leading-[1.12] tracking-tight"
            >
              Your pharmacy exams,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-brand">
                finally under control.
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mt-5 text-white/55 text-base leading-relaxed"
            >
              Structured courses, mock exams, and expert support — built for UK pharmacy students who want to pass with confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-10 grid grid-cols-3 gap-3"
            >
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/8 border border-white/10 px-4 py-4 backdrop-blur-sm">
                  <s.icon className="w-4 h-4 text-pink-200 mb-2" />
                  <p className="font-heading font-extrabold text-lg text-white leading-none">{s.value}</p>
                  <p className="text-[10px] text-white/50 font-semibold uppercase tracking-wide mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <p className="text-xs text-white/35">© {new Date().getFullYear()} PharmaWithUs</p>
        </aside>

        {/* Form panel — back link pinned top-left of this column on desktop */}
        <div className="relative flex flex-col min-h-screen px-4 py-8 sm:px-8 lg:px-12 xl:px-16 lg:justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-brand transition-colors mb-8 lg:mb-0 lg:absolute lg:top-10 lg:left-12 xl:left-16 z-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back home
          </Link>

          <div className="w-full max-w-[440px] mx-auto lg:mx-0 lg:ml-10 xl:ml-16 flex-1 flex flex-col justify-center">
            <div className="lg:hidden mb-6 flex justify-center">
              <BrandLogo size="sm" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              {courseBanner && (
                <div className="mb-5 px-4 py-3 rounded-2xl bg-brand/10 border border-brand/20 text-sm text-text">
                  <span className="font-semibold text-brand">Almost there —</span>{' '}
                  {courseBanner}
                </div>
              )}

              <div className="auth-card">
                <div className="mb-8">
                  <h1 className="font-heading font-extrabold text-2xl sm:text-[1.75rem] text-text tracking-tight">
                    {title}
                  </h1>
                  <p className="mt-2 text-sm text-text-secondary leading-relaxed">{subtitle}</p>
                </div>

                {children}
              </div>

              {footer && <div className="mt-6 text-center">{footer}</div>}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
