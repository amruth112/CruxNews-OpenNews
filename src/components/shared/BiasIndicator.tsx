import clsx from 'clsx';
import type { BiasCategory } from '../../types';

interface BiasIndicatorProps {
  bias: BiasCategory;
  showText?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const biasColors: Record<BiasCategory, string> = {
  'left': 'bg-[var(--bias-left)]',
  'left-center': 'bg-[var(--bias-left-center)]',
  'center': 'bg-[var(--bias-center)]',
  'right-center': 'bg-[var(--bias-right-center)]',
  'right': 'bg-[var(--bias-right)]',
  'independent': 'bg-[var(--bias-independent)]',
};

const biasLabels: Record<BiasCategory, string> = {
  'left': 'Left',
  'left-center': 'Left-Center',
  'center': 'Center',
  'right-center': 'Right-Center',
  'right': 'Right',
  'independent': 'Independent',
};

export function BiasIndicator({ bias, showText = false, className, size = 'md' }: BiasIndicatorProps) {
  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div 
        className={clsx('rounded-full shrink-0', dotSizes[size], biasColors[bias])}
        title={biasLabels[bias]}
      />
      {showText && (
        <span className={clsx('font-medium text-[var(--text-secondary)]', textSizes[size])}>
          {biasLabels[bias]}
        </span>
      )}
    </div>
  );
}
