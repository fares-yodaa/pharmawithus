import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { GlowButton } from '../ui/GlowButton';
import { BrandLogo } from '../auth/BrandLogo';
import { useAuth } from '../../context/AuthContext';

interface NavBarProps {
  onJoinNow: () => void;
}

export function NavBar({ onJoinNow }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, isAdmin } = useAuth();
  const dashTo = !user ? '/login' : isAdmin ? '/admin' : '/dashboard';
  const displayInitial =
    profile?.full_name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    '?';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const links = [
    { label: 'Courses', href: '#courses' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
    { label: 'Reviews', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between h-[4.25rem]">
        <BrandLogo size="sm" />

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-brand rounded-lg hover:bg-brand-50 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <Link
              to={dashTo}
              className="flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full border border-border bg-white hover:border-brand/30 hover:shadow-md transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                {displayInitial}
              </div>
              <span className="text-sm font-semibold text-text">Dashboard</span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-text-secondary hover:text-brand px-3 py-2">
                Sign in
              </Link>
              <GlowButton size="sm" onClick={onJoinNow}>Start learning</GlowButton>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 border border-border text-text shrink-0"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-white overflow-hidden"
          >
            <nav className="px-4 py-4 flex flex-col gap-1">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 px-4 rounded-xl text-sm font-semibold text-text-secondary hover:bg-brand-lighter hover:text-brand"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="px-4 pb-6 pt-2">
              {user ? (
                <Link
                  to={dashTo}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-brand text-white font-bold text-sm"
                >
                  Go to dashboard
                </Link>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-3 rounded-xl border-2 border-brand text-brand font-bold text-sm">
                    Sign in
                  </Link>
                  <GlowButton size="sm" onClick={() => { setMobileOpen(false); onJoinNow(); }} className="flex-1">
                    Start
                  </GlowButton>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
