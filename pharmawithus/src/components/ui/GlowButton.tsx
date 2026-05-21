import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlowButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  id?: string;
}

export function GlowButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  id,
}: GlowButtonProps) {
  const baseClasses =
    'relative inline-flex items-center justify-center font-heading font-semibold rounded-full transition-all duration-300 cursor-pointer select-none';

  const sizeClasses = {
    sm: 'px-5 py-2.5 text-sm gap-2',
    md: 'px-7 py-3 text-base gap-2',
    lg: 'px-9 py-4 text-lg gap-2.5',
  };

  const variantClasses = {
    primary: 'bg-brand text-white pink-glow hover:bg-brand-dark',
    secondary: 'bg-white text-brand border-2 border-brand hover:bg-brand-lighter',
    ghost: 'bg-transparent text-text-secondary hover:text-brand hover:bg-brand-50',
  };

  return (
    <motion.button
      id={id}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
