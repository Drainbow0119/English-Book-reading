import React from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen } from 'lucide-react';
import { DifficultyLevel } from '../types';

interface HeaderProps {
  currentPage?: number;
  totalPages?: number;
  difficulty: DifficultyLevel;
  onHomeClick?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  totalPages = 10,
  difficulty,
  onHomeClick,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-amber-200/60 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Brand wordmark */}
        <button
          onClick={onHomeClick}
          className="flex items-center gap-2 text-left group focus-visible:outline-2 focus-visible:outline-amber-600 rounded-lg p-1"
          title="Return to Cover"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-lg border border-amber-200">
            <BookOpen className="w-4 h-4 text-amber-800" />
          </div>
          <span className="font-display font-bold text-base sm:text-lg tracking-tight text-amber-950 group-hover:text-amber-700 transition-colors whitespace-nowrap">
            StoryWalk!
          </span>
        </button>

        {/* Zone 2: Clean unboxed metadata */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-slate-600 whitespace-nowrap">
          {currentPage !== undefined && (
            <>
              <span className="text-slate-900 font-semibold tabular-nums">
                Page {currentPage} / {totalPages}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
            </>
          )}
          <span className="text-amber-800 font-medium">
            Level {difficulty}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="hidden sm:inline text-slate-500 text-xs">
            CEFR A1
          </span>
        </div>

        {/* Zone 3: Primary action / sound toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            title={isMuted ? 'Sound muted' : 'Sound active'}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-amber-600"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-amber-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
