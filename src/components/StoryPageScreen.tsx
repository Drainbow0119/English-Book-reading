import React, { useState, useEffect } from 'react';
import { Volume2, Square, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import { StoryPage } from '../types';
import { speakText, stopSpeech, sfx } from '../utils/audio';

interface StoryPageScreenProps {
  page: StoryPage;
  totalPages: number;
  onGoToQuestion: () => void;
  isMuted: boolean;
}

export const StoryPageScreen: React.FC<StoryPageScreenProps> = ({
  page,
  totalPages,
  onGoToQuestion,
  isMuted,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSlowMode, setIsSlowMode] = useState(false);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);
  const [selectedWordHint, setSelectedWordHint] = useState<string | null>(null);

  // Stop audio whenever page changes
  useEffect(() => {
    stopSpeech();
    setIsPlayingAudio(false);
    setActiveSentenceIndex(null);
    setSelectedWordHint(null);
  }, [page.pageNumber]);

  // Read the full page sentence by sentence
  const handleReadAloud = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      setActiveSentenceIndex(null);
      return;
    }

    if (isMuted) return;

    setIsPlayingAudio(true);
    let index = 0;

    const playNextSentence = () => {
      if (index >= page.sentences.length) {
        setIsPlayingAudio(false);
        setActiveSentenceIndex(null);
        return;
      }

      setActiveSentenceIndex(index);
      const sentence = page.sentences[index].fullText;
      const rate = isSlowMode ? 0.75 : 0.95;

      speakText(sentence, {
        rate,
        onEnd: () => {
          index += 1;
          // Short pause between sentences
          setTimeout(() => {
            playNextSentence();
          }, 350);
        },
      });
    };

    playNextSentence();
  };

  const handleWordClick = (word: string) => {
    sfx.playPop();
    setSelectedWordHint(word);
    if (!isMuted) {
      speakText(word, { rate: isSlowMode ? 0.7 : 0.9 });
    }
  };

  const handleNextClick = () => {
    stopSpeech();
    sfx.playPop();
    onGoToQuestion();
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-3 sm:py-6 flex flex-col min-h-[calc(100vh-4rem)] justify-between">
      {/* Top Bar inside story page: Page counter + scene kicker */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-slate-800 bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-200">
            Page {page.pageNumber} / {totalPages}
          </span>
          <span className="text-xs sm:text-sm font-medium text-slate-600">
            {page.title}
          </span>
        </div>
      </div>

      {/* Top Half: Illustration */}
      <div className="w-full relative rounded-2xl overflow-hidden shadow-md border border-amber-200/90 bg-amber-50 aspect-4/3 mb-4 shrink-0">
        <img
          src={page.image}
          alt={page.imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
          referrerPolicy="no-referrer"
        />
        {/* Subtle scene tag banner */}
        <div className="absolute bottom-2 left-2 bg-slate-900/75 backdrop-blur-xs text-white text-[11px] sm:text-xs px-2.5 py-1 rounded-md">
          {page.sceneTheme}
        </div>
      </div>

      {/* Word definition / pronunciation hint popup if tapped */}
      {selectedWordHint && (
        <div className="mb-3 px-3 py-2 bg-amber-100 border border-amber-300 rounded-xl text-xs sm:text-sm text-amber-950 flex items-center justify-between animate-fadeIn">
          <div>
            <span className="font-bold">Locational Preposition: </span>
            <span className="font-mono font-semibold bg-white/70 px-1.5 py-0.5 rounded text-amber-900">
              {selectedWordHint}
            </span>
            <span className="text-slate-600 ml-2">
              (Describes where something is located)
            </span>
          </div>
          <button
            onClick={() => setSelectedWordHint(null)}
            className="text-amber-800 hover:text-amber-950 text-xs font-bold px-1.5 py-0.5 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* Bottom Half: Story text (5 to 6 sentences, key words underlined) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs grow flex flex-col justify-center space-y-2.5 mb-4">
        {page.sentences.map((sent, sIdx) => {
          const isSentenceActive = activeSentenceIndex === sIdx;
          return (
            <p
              key={sIdx}
              className={`text-sm sm:text-base leading-relaxed transition-colors duration-200 rounded-lg px-2 py-1 ${
                isSentenceActive
                  ? 'bg-amber-100/90 text-amber-950 font-medium'
                  : 'text-slate-800'
              }`}
            >
              {sent.parts.map((part, pIdx) => {
                if (part.isPreposition) {
                  return (
                    <button
                      key={pIdx}
                      onClick={() => handleWordClick(part.text)}
                      title="Tap to hear pronunciation and tip"
                      className="inline-block font-normal text-slate-900 underline decoration-amber-400 decoration-1 underline-offset-4 hover:text-amber-900 hover:decoration-amber-600 rounded px-0.5 transition-colors cursor-pointer"
                    >
                      {part.text}
                    </button>
                  );
                }
                if (part.isObject) {
                  return (
                    <span
                      key={pIdx}
                      className="font-normal text-slate-900"
                    >
                      {part.text}
                    </span>
                  );
                }
                return <span key={pIdx} className="font-normal">{part.text}</span>;
              })}
            </p>
          );
        })}
      </div>

      {/* Bottom Action Bar: Read Aloud controls (left) + Next Button (right) */}
      <div className="flex items-center justify-between gap-3 pt-2 pb-1 border-t border-amber-200/50">
        {/* Left: Audio Read Aloud & Slow Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReadAloud}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs focus-visible:outline-2 focus-visible:outline-amber-600 ${
              isPlayingAudio
                ? 'bg-amber-800 text-white animate-pulse'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-800" />
                <span>Read to me</span>
              </>
            )}
          </button>

          {/* Slow toggle [🐢 Slow] */}
          <button
            onClick={() => {
              sfx.playPop();
              setIsSlowMode(!isSlowMode);
            }}
            className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
              isSlowMode
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title="Toggle slower audio speed for easy listening"
          >
            🐢 Slow {isSlowMode ? 'ON' : ''}
          </button>
        </div>

        {/* Right: Next Button */}
        <button
          onClick={handleNextClick}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-sm hover:shadow transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-amber-900"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
