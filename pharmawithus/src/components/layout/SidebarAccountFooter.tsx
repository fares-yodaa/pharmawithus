import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SidebarAccountFooterProps {
  roleLabel: string;
  showAdminLink?: boolean;
}

export function SidebarAccountFooter({ roleLabel, showAdminLink = false }: SidebarAccountFooterProps) {
  const { profile, signOut, isAdmin } = useAuth();

  const initial = profile?.full_name?.charAt(0)?.toUpperCase() || 'U';
  const name = profile?.full_name || 'Account';

  return (
    <div className="sidebar-account">
      <button type="button" onClick={() => signOut()} className="sidebar-account__signout">
        Sign out
      </button>

      <div className="sidebar-account__user">
        <span className="sidebar-account__avatar">{initial}</span>
        <div className="min-w-0">
          <p className="sidebar-account__name">{name}</p>
          <p className="sidebar-account__role">{roleLabel}</p>
        </div>
      </div>

      {showAdminLink && isAdmin && (
        <Link to="/admin" className="sidebar-account__admin-link">
          Admin panel
        </Link>
      )}
    </div>
  );
}
