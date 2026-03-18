import { Moon, Sun, Monitor } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import clsx from 'clsx';
import type { Theme } from '../../types';

export function ThemeToggle() {
  const { theme, setTheme } = useSettings();

  const options: { id: Theme; label: string; icon: React.ReactNode }[] = [
    { id: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
    { id: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
    { id: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> },
  ];

  return (
    <div className="flex p-1 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border)]">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => setTheme(opt.id)}
          className={clsx(
            'flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-md transition-all',
            theme === opt.id
              ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
          )}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
