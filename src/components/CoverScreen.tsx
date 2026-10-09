import React from 'react';
import { Play, Compass, Sparkles, BookOpen, Layers } from 'lucide-react';
import { DifficultyLevel } from '../types';
import { COVER_IMAGE } from '../data/storyData';
import { sfx } from '../utils/audio';

interface CoverScreenProps {
  difficulty: DifficultyLevel;
  onSelectDifficulty: (level: DifficultyLevel) => void;
  onStartStory: () => void;
}

export const CoverScreen: React.FC<CoverScreenProps> = ({
  difficulty,
  onSelectDifficulty,
  onStartStory,
}) => {
  const difficultyLevels: {
    level: DifficultyLevel;
    title: string;
    description: string;
  }[] = [
    { level: 1, title: 'Level 1: 1 Blank', description: 'Choose the position word (e.g. behind, in, under)' },
    { level: 2, title: 'Level 2: 2 Blanks', description: 'Fill 2 missing words (e.g. under + box)' },
    { level: 3, title: 'Level 3: 3 Blanks', description: 'Fill 3 missing words (e.g. is + behind + clock)' },
    { level: 4, title: 'Level 4: Word Blocks', description: 'Put the word blocks in the right order' },
    { level: 5, title: 'Level 5: Make Sentences', description: 'Make the whole sentence from words' },
  ];

  const handleStart = () => {
    sfx.playCorrect();
    onStartStory();
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center">
      {/* Title & Metadata Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-800 tracking-wider uppercase mb-2">
          <span>Grade 5–6</span>
          <span aria-hidden="true">·</span>
          <span>CEFR A1</span>
          <span aria-hidden="true">·</span>
          <span>10–15 Minutes</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance leading-tight">
          The Mystery of the Golden Compass
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 font-normal">
          An interactive picture-book walk with Detective Leo & Barnaby the Cat
        </p>
      </div>

      {/* Cover Illustration */}
      <div className="w-full relative rounded-2xl overflow-hidden shadow-lg border border-amber-200/80 bg-amber-100/50 aspect-4/3 mb-6">
        <img
          src={COVER_IMAGE}
          alt="Detective Leo and his ginger cat Barnaby with magnifying glass in cozy antique study room"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Elegant CSS fallback if image asset fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        {/* Subtle bottom vignette scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent flex items-end p-4">
          <div className="text-white text-xs sm:text-sm font-medium flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Practice: in, on, under, behind, in front of, next to, between</span>
          </div>
        </div>
      </div>

      {/* Difficulty Level Selector */}
      <div className="w-full bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-700" />
            <span className="text-sm font-bold text-slate-900">Select Difficulty Level</span>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Levels 1–5
          </span>
        </div>

        {/* Level buttons */}
        <div className="grid grid-cols-5 gap-1.5 p-1 bg-amber-50/70 rounded-xl border border-amber-100">
          {difficultyLevels.map((d) => {
            const isActive = difficulty === d.level;
            return (
              <button
                key={d.level}
                onClick={() => {
                  sfx.playPop();
                  onSelectDifficulty(d.level);
                }}
                className={`py-2 px-1 text-center rounded-lg text-xs sm:text-sm font-bold transition-all focus-visible:outline-2 focus-visible:outline-amber-600 ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-xs scale-102'
                    : 'text-amber-900/70 hover:bg-amber-200/40 hover:text-amber-950'
                }`}
              >
                Level {d.level}
              </button>
            );
          })}
        </div>

        {/* Current Level Description */}
        <div className="mt-3 px-3 py-2 bg-amber-50/40 rounded-xl border border-amber-100/60 text-xs sm:text-sm text-slate-700 flex items-start gap-2">
          <span className="font-semibold text-amber-900 whitespace-nowrap">
            {difficultyLevels.find((d) => d.level === difficulty)?.title}:
          </span>
          <span className="text-slate-600">
            {difficultyLevels.find((d) => d.level === difficulty)?.description}
          </span>
        </div>
      </div>

      {/* Start Button - Large, centered, bottom third */}
      <div className="w-full">
        <button
          onClick={handleStart}
          className="w-full h-14 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-lg sm:text-xl flex items-center justify-center gap-3 shadow-md hover:shadow-lg active:scale-[0.99] transition-all focus-visible:outline-2 focus-visible:outline-amber-900"
        >
          <Play className="w-6 h-6 fill-current" />
          <span>Start Story</span>
        </button>

        <p className="text-center text-xs text-slate-500 mt-3 font-medium">
          🎧 Use sound for read-aloud voice & pronunciation practice
        </p>
      </div>
    </div>
  );
};
