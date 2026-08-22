import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock } from 'lucide-react';
import { AppAlert } from '../ui/AppAlert';

export const ORDER_STATUS = {
  pending: { label: 'Pending review', className: 'user-badge user-badge--pending' },
  approved: { label: 'Approved', className: 'user-badge user-badge--approved' },
  rejected: { label: 'Rejected', className: 'user-badge user-badge--rejected' },
} as const;

export function UserPageError({
  message,
  title = "Couldn't load this page",
  onRetry,
}: {
  message: string;
  title?: string;
  onRetry?: () => void;
}) {
  return (
    <AppAlert variant="error" title={title} onRetry={onRetry} className="max-w-lg">
      {message}
    </AppAlert>
  );
}

export function UserFormError({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  if (!message) return null;
  return (
    <AppAlert
      variant={message.includes('upload') || message.includes('required') ? 'warning' : 'error'}
      onDismiss={onDismiss}
    >
      {message}
    </AppAlert>
  );
}

export function UserLoading() {
  return (
    <div className="user-loading">
      <div className="user-loading__ring" />
      <p className="text-sm text-text-muted mt-4">Loading your workspace…</p>
    </div>
  );
}

interface UserPageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
  eyebrow?: string;
}

export function UserPageHeader({ title, description, action, eyebrow }: UserPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        {eyebrow && <p className="user-eyebrow mb-2">{eyebrow}</p>}
        <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-text tracking-tight">{title}</h1>
        <p className="mt-1.5 text-sm text-text-secondary max-w-xl leading-relaxed">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function UserWelcomeBanner({
  name,
  coursesCount,
  pendingOrders,
}: {
  name: string;
  coursesCount: number;
  pendingOrders: number;
}) {
  const first = name.split(' ')[0] || 'there';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="user-welcome mb-8"
    >
      <div className="user-welcome__glow" aria-hidden />
      <div className="relative z-10">
        <p className="text-sm font-semibold text-white/80">Welcome back</p>
        <h2 className="font-heading font-extrabold text-xl md:text-2xl text-white mt-1">
          Hey {first}, ready to study?
        </h2>
        <p className="text-sm text-white/70 mt-2 max-w-md">
          {coursesCount > 0
            ? `You have ${coursesCount} active course${coursesCount === 1 ? '' : 's'}. Pick up where you left off.`
            : 'Browse our courses and start preparing for your pharmacy exams with confidence.'}
        </p>
        {pendingOrders > 0 && (
          <p className="mt-3 text-xs font-semibold text-amber-200">
            {pendingOrders} order{pendingOrders === 1 ? '' : 's'} awaiting payment verification.
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function UserCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`user-card ${className}`}>{children}</div>;
}

export function UserEmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="user-empty">
      <div className="user-empty__icon">{icon}</div>
      <h3 className="font-heading font-bold text-lg text-text mt-4">{title}</h3>
      <p className="text-sm text-text-muted mt-2 max-w-sm mx-auto leading-relaxed">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function UserPrimaryButton({
  children,
  to,
  onClick,
  disabled,
  className = '',
  type = 'button',
}: {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}) {
  const cls = `user-btn user-btn--primary ${className}`;
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

export function UserGhostButton({
  children,
  to,
  onClick,
  className = '',
}: {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  className?: string;
}) {
  const cls = `user-btn user-btn--ghost ${className}`;
  if (to) {
    return <Link to={to} className={cls}>{children}</Link>;
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function UserStatusBadge({ status }: { status: string }) {
  const cfg = ORDER_STATUS[status as keyof typeof ORDER_STATUS] ?? ORDER_STATUS.pending;
  return <span className={cfg.className}>{cfg.label}</span>;
}

export function UserFieldLabel({ children }: { children: ReactNode }) {
  return <label className="user-field-label">{children}</label>;
}

export function UserInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`user-input ${props.className ?? ''}`} />;
}

interface CourseCardData {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  picture_url?: string | null;
  lesson_count?: number;
  duration?: string;
  pass_rate?: number;
  price?: number;
  anchor_price?: number;
  currency?: string;
  badge?: string | null;
}

export function UserOwnedCourseCard({
  course,
  index = 0,
}: {
  course: CourseCardData;
  index?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="user-course-card user-course-card--owned group"
    >
      <div className="user-course-card__media">
        {course.picture_url ? (
          <img src={course.picture_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <BookOpen className="w-10 h-10 text-brand/40" />
        )}
        <span className="user-course-card__pill user-course-card__pill--active">Active</span>
      </div>
      <div className="user-course-card__body">
        <h3 className="font-heading font-bold text-base text-text line-clamp-2">{course.title}</h3>
        {course.subtitle && <p className="text-xs text-text-muted mt-1 line-clamp-1">{course.subtitle}</p>}
        <div className="flex flex-wrap gap-3 mt-3 text-xs text-text-muted">
          {course.lesson_count != null && (
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-brand" /> {course.lesson_count} lessons
            </span>
          )}
          {course.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand" /> {course.duration}
            </span>
          )}
        </div>
        <UserPrimaryButton to={`/dashboard/course/${course.id}`} className="w-full mt-4 !py-2.5 !text-xs">
          Continue learning
        </UserPrimaryButton>
      </div>
    </motion.article>
  );
}

export function UserOrderCard({
  order,
  index = 0,
}: {
  order: {
    id: string;
    status: string;
    amount: number | null;
    admin_note: string | null;
    created_at: string;
    course: { title: string; currency: string } | null;
  };
  index?: number;
}) {
  const date = new Date(order.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="user-order-card"
    >
      <div className="user-order-card__icon">
        <BookOpen className="w-5 h-5" />
      </div>
      <div className="user-order-card__info">
        <h4 className="font-heading font-bold text-sm text-text truncate">
          {order.course?.title || 'Course purchase'}
        </h4>
        <p className="text-xs text-text-muted mt-0.5">{date}</p>
      </div>
      <p className="user-order-card__price">
        ${order.amount ?? '—'}
      </p>
      <div className="user-order-card__status">
        <UserStatusBadge status={order.status} />
      </div>
      {order.status === 'rejected' && order.admin_note && (
        <p className="user-order-card__note">
          <strong>Admin note:</strong> {order.admin_note}
        </p>
      )}
    </motion.div>
  );
}

export function UserBrowseCourseCard({
  course,
  index = 0,
}: {
  course: CourseCardData;
  index?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="user-course-card user-course-card--browse group"
    >
      {course.badge && <span className="user-course-card__badge">{course.badge}</span>}
      <div className="user-course-card__media user-course-card__media--tall">
        {course.picture_url ? (
          <img
            src={course.picture_url}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <BookOpen className="w-12 h-12 text-brand/30" />
        )}
      </div>
      <div className="user-course-card__body">
        <h3 className="font-heading font-bold text-lg text-text leading-snug">{course.title}</h3>
        {course.subtitle && <p className="text-sm text-brand font-medium mt-1">{course.subtitle}</p>}
        {course.description && (
          <p className="text-sm text-text-secondary mt-2 line-clamp-2 leading-relaxed">{course.description}</p>
        )}
        <ul className="mt-4 space-y-1.5 text-xs text-text-muted">
          {course.duration && (
            <li className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-brand shrink-0" /> {course.duration}
            </li>
          )}
          {course.pass_rate != null && (
            <li className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-success/20 shrink-0" />
              {course.pass_rate}% pass rate
            </li>
          )}
          {course.lesson_count != null && (
            <li className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-brand shrink-0" /> {course.lesson_count} lessons
            </li>
          )}
        </ul>
        <div className="flex items-end justify-between gap-3 mt-5 pt-5 border-t border-border/80">
          <div>
            <span className="font-heading font-extrabold text-2xl text-brand">
              ${course.price}
            </span>
          </div>
          <UserPrimaryButton to={`/dashboard/purchase/${course.id}`} className="!py-2.5 !px-5 !text-xs shrink-0">
            Enroll
          </UserPrimaryButton>
        </div>
      </div>
    </motion.article>
  );
}
