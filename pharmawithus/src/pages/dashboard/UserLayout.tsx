import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { BookOpen, ShoppingBag, FileText } from 'lucide-react';
import { BrandLogo } from '../../components/auth/BrandLogo';
import { DrawerShell, DrawerSidebarClose } from '../../components/layout/DrawerShell';
import { SidebarAccountFooter } from '../../components/layout/SidebarAccountFooter';

const navItems = [
  { to: '/dashboard', icon: BookOpen, label: 'My Courses', end: true },
  { to: '/dashboard/browse', icon: ShoppingBag, label: 'Browse Courses', end: false },
  { to: '/dashboard/orders', icon: FileText, label: 'My Orders', end: false },
];

const titles: Record<string, string> = {
  '/dashboard': 'My Courses',
  '/dashboard/browse': 'Browse',
  '/dashboard/orders': 'My Orders',
};

function resolveTitle(pathname: string) {
  if (pathname.startsWith('/dashboard/purchase')) return 'Checkout';
  if (pathname.startsWith('/dashboard/course')) return 'Course';
  if (pathname.startsWith('/dashboard/browse')) return titles['/dashboard/browse'];
  if (pathname.startsWith('/dashboard/orders')) return titles['/dashboard/orders'];
  return titles['/dashboard'];
}

export function UserLayout() {
  const { pathname } = useLocation();

  const sidebar = (
    <div className="admin-sidebar-inner flex flex-col h-full">
      <div className="admin-sidebar__brand p-5 border-b border-white/10 flex items-center justify-between gap-3">
        <BrandLogo variant="dark" size="sm" to="/" />
        <DrawerSidebarClose />
      </div>

      <div className="admin-sidebar__body flex-1 p-4 overflow-y-auto">
        <p className="admin-sidebar__section-label">Learning</p>
        <nav className="admin-sidebar__nav">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? 'admin-nav-link--active' : ''}`
              }
            >
              <span className="admin-nav-link__icon">
                <Icon className="w-[1.125rem] h-[1.125rem]" strokeWidth={2} />
              </span>
              <span className="admin-nav-link__label">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="admin-sidebar__footer p-4 border-t border-white/10">
        <SidebarAccountFooter roleLabel="Learning account" showAdminLink />
      </div>
    </div>
  );

  return (
    <div className="admin-shell">
      <DrawerShell sidebar={sidebar} mobileTitle={resolveTitle(pathname)}>
        <main className="admin-main__content page-content">
          <Outlet />
        </main>
      </DrawerShell>
    </div>
  );
}
