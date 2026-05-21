import { useState } from 'react';
import { Link, Outlet, NavLink } from 'react-router-dom';
import { BookOpen, ShoppingBag, FileText, LogOut, Menu, ChevronRight, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function UserLayout() {
  const { profile, signOut, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const links = [
    { to: '/dashboard', icon: <BookOpen className="w-5 h-5" />, label: 'My Courses', end: true },
    { to: '/dashboard/browse', icon: <ShoppingBag className="w-5 h-5" />, label: 'Browse Courses', end: false },
    { to: '/dashboard/orders', icon: <FileText className="w-5 h-5" />, label: 'My Orders', end: false },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-brand text-white shadow-md'
        : 'text-text-secondary hover:bg-brand-lighter hover:text-brand'
    }`;

  return (
    <div className="min-h-screen bg-bg-soft flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-border flex flex-col transition-transform md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 64 64" fill="none"><path d="M20 28C20 28 18 14 32 14C46 14 44 28 44 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M38 14L44 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M16 30C16 30 14 50 32 50C50 50 48 30 48 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M16 30H48" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-text">PharmaWithUs</p>
              <p className="text-[10px] text-brand font-medium">Student Dashboard</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1.5">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-brand-lighter hover:text-brand transition-all"
          >
            <Home className="w-5 h-5" />
            Home
          </Link>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass} onClick={() => setSidebarOpen(false)}>
              {link.icon}
              {link.label}
            </NavLink>
          ))}

          {isAdmin && (
            <NavLink to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-brand-lighter hover:text-brand transition-all mt-4 border-t border-border pt-4" onClick={() => setSidebarOpen(false)}>
              <ChevronRight className="w-5 h-5" />
              Admin Panel
            </NavLink>
          )}
        </nav>

        {/* User info + logout */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white text-sm font-bold shrink-0">
              {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text truncate">{profile?.full_name || 'User'}</p>
              <p className="text-[11px] text-text-muted">Student</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer bg-transparent border-none">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        {/* Top bar (mobile) */}
        <header className="md:hidden sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-xl text-text-secondary cursor-pointer bg-transparent border-none">
              <Menu className="w-5 h-5" />
            </button>
            <Link
              to="/"
              aria-label="Back to home"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-text-secondary hover:bg-brand-lighter hover:text-brand transition-colors"
            >
              <Home className="w-5 h-5" />
            </Link>
          </div>
          <span className="font-heading font-bold text-sm text-text truncate text-center flex-1 min-w-0">Dashboard</span>
          <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold">
            {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-8 max-w-6xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
