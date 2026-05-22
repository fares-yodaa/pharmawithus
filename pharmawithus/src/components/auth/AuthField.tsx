import type { InputHTMLAttributes, ReactNode } from 'react';

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: ReactNode;
  trailing?: ReactNode;
}

export function AuthField({ label, icon, trailing, className = '', id, ...props }: AuthFieldProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div>
      <label htmlFor={fieldId} className="auth-field-label">
        {label}
      </label>
      <div className="relative mt-1.5">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">{icon}</span>
        <input
          id={fieldId}
          className={`auth-field-input ${trailing ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {trailing && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{trailing}</div>
        )}
      </div>
    </div>
  );
}
