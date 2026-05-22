import type { ReactNode } from 'react';
import { AlertCircle, Info, RefreshCw, X } from 'lucide-react';

type AlertVariant = 'error' | 'warning' | 'info';

const VARIANT_CLASS: Record<AlertVariant, string> = {
  error: 'app-alert--error',
  warning: 'app-alert--warning',
  info: 'app-alert--info',
};

interface AppAlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  onDismiss?: () => void;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function AppAlert({
  variant = 'error',
  title,
  children,
  onDismiss,
  onRetry,
  retryLabel = 'Try again',
  className = '',
}: AppAlertProps) {
  const Icon = variant === 'info' ? Info : AlertCircle;

  return (
    <div
      className={`app-alert ${VARIANT_CLASS[variant]} ${className}`}
      role="alert"
    >
      <Icon className="app-alert__icon" aria-hidden />
      <div className="app-alert__body min-w-0 flex-1">
        {title && <p className="app-alert__title">{title}</p>}
        <div className="app-alert__message">{children}</div>
        {onRetry && (
          <button type="button" onClick={onRetry} className="app-alert__retry">
            <RefreshCw className="w-3.5 h-3.5" />
            {retryLabel}
          </button>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="app-alert__dismiss"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
