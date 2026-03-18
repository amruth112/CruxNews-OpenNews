import { useState } from 'react';
import clsx from 'clsx';
import { FEED_SOURCES } from '../../config/feeds';
import { Globe } from 'lucide-react';

interface SourceLogoProps {
  sourceId: string;
  sourceName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SourceLogo({ sourceId, sourceName, size = 'md', className }: SourceLogoProps) {
  const feed = FEED_SOURCES.find(f => f.id === sourceId);
  const [imageError, setImageError] = useState(false);
  
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8'
  };

  const wrapperClasses = clsx(
    'rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-white', 
    sizes[size],
    className
  );

  // Fallback to globe icon
  if (imageError || !feed?.icon) {
    return (
      <div className={wrapperClasses} title={sourceName || feed?.name}>
        <Globe className="text-gray-400 p-[2px] w-full h-full" />
      </div>
    );
  }

  return (
    <div className={wrapperClasses} title={sourceName || feed.name}>
      <img 
        src={feed.icon} 
        alt={sourceName || feed.name}
        onError={() => setImageError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
