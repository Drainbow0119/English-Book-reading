import React, { useState, useEffect } from 'react';
import { Trophy, Star, ArrowRight, RotateCcw, Award, CheckCircle2, Heart } from 'lucide-react';
import { DifficultyLevel, StoryProgress } from '../types';
import { sfx } from '../utils/audio';
import { StoryMapRetell } from './StoryMapRetell';

interface ResultScreenProps {
  progress: StoryProgress;
  totalPages: number;
  onRestartStory: (newDifficulty?: DifficultyLevel) => void;
  onUpdateDifficulty: (newLevel: DifficultyLevel) => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  progress,
  totalPages,
  onRestartStory,
  onUpdateDifficulty,
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState<'happy' | 'difficult' | null>(
    progress.userReaction || null
  );
  const [difficultyChoice, setDifficultyChoice] = useState<DifficultyLevel>(progress.difficulty);

  useEffect(() => {
    sfx.playFanfare();
  }, []);

  const handleSelectEmoji = (emoji: 'happy' | 'difficult') => {
    sfx.playPop();
    setSelectedEmoji(emoji);
  };

  const handleLevelUp = () => {
    sfx.playCorrect();
    const nextLevel = Math.min(progress.difficulty + 1, 5) as DifficultyLevel;
    setDifficultyChoice(nextLevel);
    onUpdateDifficulty(nextLevel);
    onRestartStory(nextLevel);
  };

  const handleStayLevel = () => {
    sfx.playPop();
    onRestartStory(progress.difficulty);
  };

  // Preposition mastery list from the 10 pages
  const prepositionsLearned = ['behind', 'in', 'under', 'between', 'in front of', 'next to'];

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center">
      {/* Star Badge Icon Header */}
      <div className="relative mb-4 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-amber-100 border-4 border-amber-300 flex items-center justify-center shadow-lg animate-bounce-subtle">
          <Star className="w-14 h-14 text-amber-500 fill-amber-400" />
        </div>
        <div className="absolute -top-1 -right-1 w-9 h-9 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-white shadow-xs">
          <Award className="w-5 h-5" />
        </div>
      </div>

      {/* Main Heading */}
      <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 text-center tracking-tight">
        You finished the story!
      </h1>
      <p className="text-slate-600 text-sm sm:text-base text-center mt-1 mb-6">
        Detective Leo & Barnaby found the Golden Compass with your help!
      </p>

      {/* Score Card */}
      <div className="w-full bg-white rounded-3xl p-5 sm:p-6 border border-amber-200/90 shadow-sm text-center mb-6">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
          Your Story Score
        </div>
        {/* Exact Score Line format requested by PRD: You answered X / 10 correctly */}
        <div className="text-2xl sm:text-3xl font-display font-extrabold text-amber-950 mb-2">
          You answered {progress.score} / {totalPages} correctly
        </div>
        <div className="text-xs sm:text-sm text-slate-600">
          Level {progress.difficulty} · Finished
        </div>

        {/* Mastered Prepositions Pills/Chips */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-500 mb-2">
            Locational Prepositions Practiced:
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {prepositionsLearned.map((prep, idx) => (
              <span
                key={idx}
                className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/80"
              >
                {prep}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Emoji Reaction Row */}
      <div className="w-full bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm text-center mb-6">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          How did this story feel?
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Tap one emoji to share your reflection
        </p>

        <div className="flex justify-center gap-6">
          <button
            onClick={() => handleSelectEmoji('happy')}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${
              selectedEmoji === 'happy'
                ? 'border-emerald-500 bg-emerald-50 scale-105 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span className="text-4xl" role="img" aria-label="Happy">😊</span>
            <span className="text-xs font-bold text-slate-800">Just right!</span>
          </button>

          <button
            onClick={() => handleSelectEmoji('difficult')}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${
              selectedEmoji === 'difficult'
                ? 'border-amber-500 bg-amber-50 scale-105 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span className="text-4xl" role="img" aria-label="Difficult">🙁</span>
            <span className="text-xs font-bold text-slate-800">A bit tricky</span>
          </button>
        </div>

        {selectedEmoji && (
          <p className="text-xs text-slate-600 mt-3 font-medium">
            {selectedEmoji === 'happy'
              ? 'Great! You are ready for the next challenge!'
              : 'Good practice! You can read again anytime.'}
          </p>
        )}
      </div>

      {/* Difficulty Upgrade Card */}
      <div className="w-full bg-amber-50/80 rounded-3xl p-5 border border-amber-200 shadow-sm mb-6 text-center">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Next Challenge
        </h3>

        {progress.difficulty < 5 ? (
          <div>
            <p className="text-xs sm:text-sm text-slate-600 mb-4">
              Do you want to increase the difficulty to Level {progress.difficulty + 1}?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleLevelUp}
                className="w-full py-3 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Level Up to Level {progress.difficulty + 1} 🚀</span>
              </button>

              <button
                onClick={handleStayLevel}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm border border-slate-300 transition-all"
              >
                <span>Stay at Level {progress.difficulty}</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs sm:text-sm text-slate-600 mb-4">
              ⭐ You finished the highest level (Level 5: Make Sentences)!
            </p>
            <button
              onClick={handleStayLevel}
              className="w-full py-3 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Read Again at Level 5</span>
            </button>
          </div>
        )}
      </div>

      {/* Story Map Retelling Activity (Feature 5 from PRD) */}
      <StoryMapRetell />

      {/* Return to Cover Button */}
      <div className="w-full mt-6">
        <button
          onClick={() => onRestartStory()}
          className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Return to Cover Page</span>
        </button>
      </div>
    </div>
  );
};
