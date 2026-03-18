import { Badge } from '../shared/Badge';
import { useStore } from '../../stores/newsStore';
import type { BiasCategory } from '../../types';
import clsx from 'clsx';

interface BiasSpectrumBarProps {
  categories: BiasCategory[];
  fullWidth?: boolean;
}

export function BiasSpectrumBar({ categories, fullWidth = false }: BiasSpectrumBarProps) {
  const { theme } = useStore().state;
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const allCategories: BiasCategory[] = [
    'left', 'left-center', 'center', 'right-center', 'right', 'independent'
  ];

  const colors = {
    'left': 'bg-[var(--bias-left)]',
    'left-center': 'bg-[var(--bias-left-center)]',
    'center': 'bg-[var(--bias-center)]',
    'right-center': 'bg-[var(--bias-right-center)]',
    'right': 'bg-[var(--bias-right)]',
    'independent': 'bg-[var(--bias-independent)]',
  };

  const hasCat = (cat: BiasCategory) => categories.includes(cat);

  return (
    <div className={clsx("flex h-3 rounded-full overflow-hidden border border-[var(--border)]", fullWidth ? "w-full" : "w-48")}>
      {allCategories.map(cat => (
        <div 
          key={cat}
          className={clsx(
            "flex-1 transition-all duration-300",
            hasCat(cat) ? colors[cat] : (isDark ? "bg-[var(--bg-tertiary)]" : "bg-gray-200")
          )}
          title={cat}
        />
      ))}
    </div>
  );
}
