import React, { useState } from 'react';
import { Check, ArrowUpDown, Volume2, Sparkles, RefreshCw, Trophy } from 'lucide-react';
import { RETELL_CARDS } from '../data/storyData';
import { RetellCard } from '../types';
import { speakText, sfx } from '../utils/audio';

export const StoryMapRetell: React.FC = () => {
  // Initially shuffle the 4 cards so learner can order them
  const [cards, setCards] = useState<RetellCard[]>(() => {
    return [...RETELL_CARDS].sort(() => 0.5 - Math.random());
  });

  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Check if cards are currently in correct order
  const checkOrder = (currentCards: RetellCard[]) => {
    const isOrdered = currentCards.every((card, idx) => card.correctIndex === idx);
    if (isOrdered) {
      sfx.playFanfare();
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  };

  const handleSwap = (idxA: number, idxB: number) => {
    sfx.playPop();
    const newCards = [...cards];
    const temp = newCards[idxA];
    newCards[idxA] = newCards[idxB];
    newCards[idxB] = temp;
    setCards(newCards);
    setSelectedCardIdx(null);
    checkOrder(newCards);
  };

  const handleCardClick = (idx: number) => {
    sfx.playPop();
    if (selectedCardIdx === null) {
      setSelectedCardIdx(idx);
    } else if (selectedCardIdx === idx) {
      setSelectedCardIdx(null);
    } else {
      handleSwap(selectedCardIdx, idx);
    }
  };

  const handleReset = () => {
    sfx.playPop();
    setIsCompleted(false);
    setSelectedCardIdx(null);
    setCards([...RETELL_CARDS].sort(() => 0.5 - Math.random()));
  };

  const handleSpeakCard = (card: RetellCard, e: React.MouseEvent) => {
    e.stopPropagation();
    sfx.playPop();
    speakText(`${card.stageName}: ${card.detail}`, { rate: 0.95 });
  };

  const slotLabels = ['1. Beginning', '2. Problem', '3. Event', '4. Ending'];

  return (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-6 border border-amber-200/90 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-700" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Story Map Retelling
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tap two cards to switch them into order: Beginning → Problem → Event → Ending
          </p>
        </div>

        <button
          onClick={handleReset}
          className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200"
          title="Mix cards"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Mix Cards</span>
        </button>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-900 animate-fadeIn">
          <div className="w-9 h-9 rounded-full bg-emerald-200 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 text-emerald-800" />
          </div>
          <div className="text-xs sm:text-sm">
            <div className="font-bold">Story Map Completed! 🎉</div>
            <div className="text-emerald-800">
              You put the story in the right order! Great job!
            </div>
          </div>
        </div>
      )}

      {/* 4 Cards Grid / Stack */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cards.map((card, idx) => {
          const isSelected = selectedCardIdx === idx;
          const isCorrectPosition = card.correctIndex === idx;

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between min-h-[110px] ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-300 scale-101 shadow-sm'
                  : isCompleted || isCorrectPosition
                  ? 'border-emerald-300 bg-emerald-50/30'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-amber-50/30 hover:border-amber-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                    {slotLabels[idx]}
                  </span>

                  <button
                    onClick={(e) => handleSpeakCard(card, e)}
                    className="p-1 rounded-full text-slate-400 hover:text-amber-800 hover:bg-white"
                    title="Listen to card"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  {card.stageName}: {card.summary}
                </h4>
                <p className="text-xs text-slate-600 leading-snug">
                  {card.detail}
                </p>
              </div>

              {isSelected && (
                <div className="text-[11px] font-bold text-amber-800 mt-2 text-right">
                  Selected! Tap another card to swap ⇅
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
