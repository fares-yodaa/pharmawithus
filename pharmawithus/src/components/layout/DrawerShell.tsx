import { createContext, useContext, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface DrawerShellContextValue {
  open: boolean;
  toggle: () => void;
  close: () => void;
}

const DrawerShellContext = createContext<DrawerShellContextValue | null>(null);

export function useDrawerShell() {
  const ctx = useContext(DrawerShellContext);
  if (!ctx) throw new Error('useDrawerShell must be used within DrawerShell');
  return ctx;
}

interface DrawerShellProps {
  sidebar: ReactNode;
  children: ReactNode;
  mobileTitle?: string;
  sidebarWidthClass?: string;
}

const SIDEBAR_WIDTHS: Record<string, string> = {
  'w-64': '16rem',
  'w-[16.5rem]': '16.5rem',
};

function useIsMobileNav() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 1023px)').matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const onChange = () => setMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return mobile;
}

export function DrawerShell({
  sidebar,
  children,
  mobileTitle = 'Menu',
  sidebarWidthClass = 'w-[16.5rem]',
}: DrawerShellProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isMobileNav = useIsMobileNav();

  useEffect(() => {
    if (isMobileNav) setOpen(false);
  }, [location.pathname, isMobileNav]);

  useEffect(() => {
    if (!open || !isMobileNav) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, isMobileNav]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);
  const toggle = () => setOpen((v) => !v);

  const closeNavIfMobile = () => {
    if (isMobileNav) close();
  };

  const shellStyle = {
    '--drawer-sidebar-width': SIDEBAR_WIDTHS[sidebarWidthClass] ?? '16.5rem',
  } as CSSProperties;

  const shellValue: DrawerShellContextValue = { open, toggle, close };

  return (
    <DrawerShellContext.Provider value={shellValue}>
      <div
        className={`drawer-shell min-h-screen min-h-[100dvh] w-full ${open ? 'drawer-shell--nav-open' : ''}`}
        style={shellStyle}
      >
        {isMobileNav && (
          <button
            type="button"
            className={`drawer-shell__backdrop ${open ? 'drawer-shell__backdrop--visible' : ''}`}
            onClick={close}
            aria-label="Close menu"
            tabIndex={open ? 0 : -1}
          />
        )}

        <aside
          className={`drawer-shell__sidebar ${open ? 'drawer-shell__sidebar--open' : ''}`}
          aria-hidden={!open}
          inert={!open ? true : undefined}
        >
          <div
            className="drawer-shell__sidebar-inner"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest('a')) closeNavIfMobile();
            }}
          >
            {sidebar}
          </div>
        </aside>

        <div className="drawer-shell__main">
          <header className="drawer-shell__header">
            {!open ? (
              <button
                type="button"
                onClick={toggle}
                className="drawer-shell__menu-btn"
                aria-expanded={false}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            ) : (
              <span className="w-10 shrink-0" aria-hidden />
            )}
            <span className="drawer-shell__header-title">{mobileTitle}</span>
            <span className="w-10 shrink-0" aria-hidden />
          </header>
          <div className="drawer-shell__content">
            <div className="drawer-shell__page">{children}</div>
          </div>
        </div>
      </div>
    </DrawerShellContext.Provider>
  );
}

export function DrawerSidebarClose({ className = '' }: { className?: string }) {
  const { open, close } = useDrawerShell();
  if (!open) return null;

  return (
    <button
      type="button"
      onClick={close}
      className={`drawer-shell__nav-close ${className}`}
      aria-label="Close menu"
    >
      <X className="w-5 h-5" />
    </button>
  );
}
