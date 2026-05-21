import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { GlowButton } from '../ui/GlowButton';
import { useAuth } from '../../context/AuthContext';

interface NavBarProps {
  onJoinNow: () => void;
}

function MortarIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 28C20 28 18 14 32 14C46 14 44 28 44 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M38 14L44 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 30C16 30 14 50 32 50C50 50 48 30 48 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 30H48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M26 50L24 56H40L38 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 56H44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function dashboardPath(user: { id: string } | null, isAdmin: boolean) {
  if (!user) return '/login';
  return isAdmin ? '/admin' : '/dashboard';
}

export function NavBar({ onJoinNow }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, isAdmin } = useAuth();
  const dashTo = dashboardPath(user, isAdmin);
  const displayInitial =
    profile?.full_name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    '?';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: 'Courses', href: '#courses' },
    { label: 'About', href: '#about' },
    { label: 'Combo', href: '#courses' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-border' : 'bg-white/70 backdrop-blur-md'}`}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center">
            <MortarIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-heading font-bold text-text text-sm">PharmaWithUs</span>
            <p className="text-[10px] text-brand font-medium leading-none">ace with us</p>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="text-sm font-medium text-text-secondary hover:text-brand transition-colors">{link.label}</a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              to={dashTo}
              className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full border border-border bg-white/80 hover:border-brand/40 hover:bg-brand-lighter/50 transition-colors"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-border/80"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {displayInitial}
                </div>
              )}
              <span className="text-sm font-semibold text-text">Dashboard</span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-brand transition-colors">
                Sign In
              </Link>
              <GlowButton size="sm" onClick={onJoinNow}>
                Join Now
              </GlowButton>
            </>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-text-secondary cursor-pointer bg-transparent border-none">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-white border-t border-border px-4 pb-4">
          {links.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)} className="block py-3 text-sm font-medium text-text-secondary hover:text-brand transition-colors border-b border-border/50 last:border-0">{link.label}</a>
          ))}
          <div className="mt-3">
            {user ? (
              <Link
                to={dashTo}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border border-border bg-bg-soft hover:border-brand/40 transition-colors"
              >
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover border border-border" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white text-sm font-bold">
                    {displayInitial}
                  </div>
                )}
                <div className="text-left min-w-0">
                  <p className="text-sm font-semibold text-text truncate">{profile?.full_name || 'Your account'}</p>
                  <p className="text-xs text-brand font-medium">Go to dashboard</p>
                </div>
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 rounded-xl border border-brand text-brand font-heading font-bold text-sm">
                  Sign In
                </Link>
                <GlowButton size="sm" onClick={() => { setMobileOpen(false); onJoinNow(); }} className="flex-1">
                  Join Now
                </GlowButton>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
