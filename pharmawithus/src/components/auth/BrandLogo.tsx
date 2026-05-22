import { Link } from 'react-router-dom';
import { LOGO_SRC } from '../../lib/brand';

const LOGO_HEIGHT = {
  sm: 'h-9',
  md: 'h-11',
  lg: 'h-16',
  xl: 'h-24',
} as const;

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  linkToHome?: boolean;
  /** Override link target when linkToHome is true (default `/`) */
  to?: string;
  size?: keyof typeof LOGO_HEIGHT;
  /** Show PharmaWithUs wordmark beside the logo */
  showText?: boolean;
  className?: string;
}

export function BrandLogo({
  variant = 'light',
  linkToHome = true,
  to = '/',
  size = 'md',
  showText = true,
  className = '',
}: BrandLogoProps) {
  const isDark = variant === 'dark';
  const titleSize = size === 'sm' ? 'text-base' : size === 'md' ? 'text-lg' : 'text-xl';

  const content = (
    <span className={`inline-flex items-center gap-2.5 group ${className}`}>
      <img
        src={LOGO_SRC}
        alt="PharmaWithUs"
        className={`${LOGO_HEIGHT[size]} w-auto object-contain shrink-0 transition-transform group-hover:scale-[1.03]`}
      />
      {showText && (
        <span className="text-left">
          <span
            className={`font-heading font-bold ${titleSize} tracking-tight ${
              isDark ? 'text-white' : 'text-text'
            }`}
          >
            PharmaWithUs
          </span>
          <span className="block text-[10px] font-semibold leading-none tracking-wide text-brand">
            ace with us
          </span>
        </span>
      )}
    </span>
  );

  if (linkToHome) {
    return <Link to={to}>{content}</Link>;
  }
  return content;
}
