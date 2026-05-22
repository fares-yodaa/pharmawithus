import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, BookOpen, Users } from 'lucide-react';
import { BrandLogo } from '../../components/auth/BrandLogo';
import { DrawerShell, DrawerSidebarClose } from '../../components/layout/DrawerShell';
import { SidebarAccountFooter } from '../../components/layout/SidebarAccountFooter';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders', end: false },
  { to: '/admin/courses', icon: BookOpen, label: 'Courses', end: false },
  { to: '/admin/users', icon: Users, label: 'Users', end: false },
];

const titles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/orders': 'Orders',
  '/admin/courses': 'Courses',
  '/admin/users': 'Users',
};

function resolveTitle(pathname: string) {
  if (pathname.startsWith('/admin/orders')) return titles['/admin/orders'];
  if (pathname.startsWith('/admin/courses')) return titles['/admin/courses'];
  if (pathname.startsWith('/admin/users')) return titles['/admin/users'];
  return titles['/admin'];
}

export function AdminLayout() {
  const { pathname } = useLocation();

  const sidebar = (
    <div className="admin-sidebar-inner flex flex-col h-full">
      <div className="admin-sidebar__brand p-5 border-b border-white/10 flex items-center justify-between gap-3">
        <BrandLogo variant="dark" size="sm" to="/" />
        <DrawerSidebarClose />
      </div>

      <div className="admin-sidebar__body flex-1 p-4 overflow-y-auto">
        <p className="admin-sidebar__section-label">Workspace</p>
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
        <SidebarAccountFooter roleLabel="Admin account" />
      </div>
    </div>
  );

  return (
    <div className="admin-shell">
      <DrawerShell sidebar={sidebar} mobileTitle={resolveTitle(pathname)}>
        <main className="admin-main__content">
          <Outlet />
        </main>
      </DrawerShell>
    </div>
  );
}
