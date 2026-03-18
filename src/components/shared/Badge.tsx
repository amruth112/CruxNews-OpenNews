import { type ReactNode } from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'error' | 'outline';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  const variants = {
    neutral: 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]',
    success: 'bg-[var(--success)]/20 text-[var(--success)]',
    warning: 'bg-yellow-500/20 text-yellow-500', // Hardcoded warning color
    error: 'bg-[var(--danger)]/20 text-[var(--danger)]',
    outline: 'border border-[var(--border)] text-[var(--text-secondary)] bg-transparent'
  };

  return (
    <span className={clsx(
      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
