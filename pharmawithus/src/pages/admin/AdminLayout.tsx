import { useState } from 'react';
import { Link, Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, BookOpen, Users, LogOut, Menu, Shield, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AdminLayout() {
  const { profile, user, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => { await signOut(); };

  const links = [
    { to: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', end: true },
    { to: '/admin/orders', icon: <ShoppingBag className="w-5 h-5" />, label: 'Orders', end: false },
    { to: '/admin/courses', icon: <BookOpen className="w-5 h-5" />, label: 'Courses', end: false },
    { to: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Users', end: false },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      isActive 
        ? 'bg-brand text-white shadow-md' 
        : 'text-text-secondary hover:bg-brand-lighter hover:text-brand'
    }`;

  // Helper to determine the current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Overview';
    if (path.includes('/admin/orders')) return 'Order Management';
    if (path.includes('/admin/courses')) return 'Course Catalog';
    if (path.includes('/admin/users')) return 'User Directory';
    return 'Admin Panel';
  };

  return (
    <div className="min-h-screen bg-bg-soft flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-border flex flex-col transition-transform md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-text">PharmaWithUs</p>
              <p className="text-[10px] text-brand font-medium">Admin Workspace</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-brand-lighter hover:text-brand transition-all"
          >
            <Home className="w-5 h-5" />
            Home
          </Link>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={navLinkClass} onClick={() => setSidebarOpen(false)}>{l.icon}{l.label}</NavLink>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white text-sm font-bold shrink-0">
              {profile?.full_name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text truncate">{profile?.full_name || 'System Admin'}</p>
              <p className="text-[11px] text-text-muted truncate">{user?.email || 'admin@pharmawithus'}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer bg-transparent border-none">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Workspace */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-border px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 sm:gap-4 min-w-0 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-text-secondary cursor-pointer bg-transparent border-none"><Menu className="w-5 h-5" /></button>
            <Link
              to="/"
              aria-label="Back to home"
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-text-secondary hover:bg-brand-lighter hover:text-brand transition-colors"
            >
              <Home className="w-5 h-5" />
            </Link>
            <h1 className="font-heading font-bold text-sm md:text-xl text-text hidden sm:block truncate">{getPageTitle()}</h1>
          </div>
          
          <div className="md:hidden w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold">
            {profile?.full_name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
