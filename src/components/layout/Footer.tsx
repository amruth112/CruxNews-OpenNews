import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 text-[var(--text-primary)] font-bold">
              <svg width="24" height="24" viewBox="0 0 64 64" className="shrink-0">
                <rect width="64" height="64" rx="14" fill="#0a0a0a"/>
                <path d="M34 29 C34 31.5,32.5 33.5,30 33.5 C27 33.5,25.5 31,25.5 28.5 C25.5 25.5,28 22.5,31 22.5 C35 22.5,38.5 25,39 29 C39.5 34,36 38.5,31 38.5 C24.5 38.5,20.5 34,20 28.5 C19.5 22,24 16.5,31 16 C39.5 15.5,46 22,46 30 C46 39,40 47,31 47" fill="none" stroke="#f5f0eb" strokeWidth="4" strokeLinecap="round"/>
              </svg>
              OpenNews
            </div>
            <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-sm">
              An open-source news aggregator that shows how different outlets cover the same story, designed to combat polarization.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <a 
              href="https://github.com/amruth112/CruxNews-OpenNews" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--text-secondary)] rounded-lg transition-colors"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
            
            <p className="text-xs text-[var(--text-tertiary)]">
              Built by the <a href="https://cruxnews.io" target="_blank" rel="noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline underline-offset-2">CruxNews team</a>
            </p>
          </div>

        </div>
        
        <div className="mt-8 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[var(--text-tertiary)]">
          <p>
            Media bias data derived from Media Bias/Fact Check.
          </p>
          <p>
            MIT License — Use it, fork it, build on it.
          </p>
        </div>
      </div>
    </footer>
  );
}
