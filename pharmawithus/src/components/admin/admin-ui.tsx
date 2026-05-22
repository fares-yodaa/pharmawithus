import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const ORDER_STATUS = {
  pending: { label: 'Pending', className: 'admin-badge admin-badge--pending', dot: 'bg-amber-400' },
  approved: { label: 'Approved', className: 'admin-badge admin-badge--approved', dot: 'bg-emerald-400' },
  rejected: { label: 'Rejected', className: 'admin-badge admin-badge--rejected', dot: 'bg-red-400' },
} as const;

export function AdminLoading() {
  return (
    <div className="admin-loading">
      <div className="admin-loading__ring" />
      <p className="text-sm text-text-muted mt-4">Loading…</p>
    </div>
  );
}

interface AdminPageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-text tracking-tight">{title}</h1>
        <p className="mt-1.5 text-sm text-text-secondary max-w-xl">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

interface AdminStatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  tone?: 'brand' | 'amber' | 'emerald' | 'ink';
  delay?: number;
}

export function AdminStatCard({ label, value, icon, tone = 'brand', delay = 0 }: AdminStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`admin-stat-card admin-stat-card--${tone}`}
    >
      <div className="admin-stat-card__icon">{icon}</div>
      <p className="admin-stat-card__value">{value}</p>
      <p className="admin-stat-card__label">{label}</p>
    </motion.div>
  );
}

export function AdminSearchInput({
  value,
  onChange,
  placeholder = 'Search…',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="admin-search">
      <svg className="w-4 h-4 text-text-muted shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="admin-search__input"
      />
    </div>
  );
}

export function AdminFilterPills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="admin-filter-pills">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`admin-filter-pill ${value === opt ? 'admin-filter-pill--active' : ''}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function AdminStatusBadge({ status }: { status: string }) {
  const cfg = ORDER_STATUS[status as keyof typeof ORDER_STATUS] ?? ORDER_STATUS.pending;
  return (
    <span className={cfg.className}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export function AdminCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`admin-card ${className}`}>{children}</div>;
}

export function AdminCardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="admin-card__header">
      <h3 className="font-heading font-bold text-base text-text">{title}</h3>
      {action}
    </div>
  );
}

export function AdminEmptyState({ message }: { message: string }) {
  return (
    <div className="admin-empty">
      <p>{message}</p>
    </div>
  );
}

export function AdminPrimaryButton({
  children,
  onClick,
  disabled,
  className = '',
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`admin-btn admin-btn--primary ${className}`}>
      {children}
    </button>
  );
}

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  wide?: boolean;
}

export function AdminModal({ open, onClose, title, subtitle, children, wide }: AdminModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            className="fixed inset-0 z-[51] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none"
          >
            <div
              className={`admin-modal pointer-events-auto w-full sm:max-w-[28rem] rounded-t-2xl sm:rounded-2xl ${wide ? 'admin-modal--wide sm:max-w-[42rem]' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="admin-modal__header">
                <div>
                  <h3 className="font-heading font-bold text-lg text-text">{title}</h3>
                  {subtitle && <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>}
                </div>
                <button type="button" onClick={onClose} className="admin-modal__close" aria-label="Close">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="admin-modal__body">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function AdminDetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between items-center gap-4 py-2.5 border-b border-border/80 last:border-0 text-sm">
      <span className="text-text-muted shrink-0">{label}</span>
      <span className="font-medium text-text text-right">{children}</span>
    </div>
  );
}

export function AdminFieldLabel({ children }: { children: ReactNode }) {
  return <label className="admin-field-label">{children}</label>;
}

export function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`admin-input ${props.className ?? ''}`} />;
}

export function AdminTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`admin-input admin-input--textarea ${props.className ?? ''}`} />;
}
