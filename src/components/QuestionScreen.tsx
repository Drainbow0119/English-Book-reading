import React, { useState, useEffect } from 'react';
import { Volume2, RotateCcw, Check, Sparkles, AlertCircle, ArrowRight, Eye, BookOpen } from 'lucide-react';
import { QuestionData, DifficultyLevel } from '../types';
import { speakText, stopSpeech, sfx } from '../utils/audio';
import { ReadAlongModal } from './ReadAlongModal';

interface QuestionScreenProps {
  question: QuestionData;
  pageNumber: number;
  totalPages: number;
  difficulty: DifficultyLevel;
  onAnswerComplete: (firstTry: boolean, attempts: number) => void;
  onBackToStory: () => void;
  isMuted: boolean;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  question,
  pageNumber,
  totalPages,
  difficulty,
  onAnswerComplete,
  onBackToStory,
  isMuted,
}) => {
  // State for blanks filling
  const [filledBlanks, setFilledBlanks] = useState<string[]>([]);
  // State for Level 4 chunks
  const [placedChunks, setPlacedChunks] = useState<string[]>([]);
  // State for Level 5 sentence words
  const [placedWords, setPlacedWords] = useState<string[]>([]);

  // Feedback states
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showReadAlong, setShowReadAlong] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Play question audio automatically on mount
  useEffect(() => {
    setFilledBlanks([]);
    setPlacedChunks([]);
    setPlacedWords([]);
    setStatus('idle');
    setFeedbackMessage(null);
    setAttempts(0);
    setShowHint(false);
    setShowReadAlong(false);
    setRevealed(false);

    if (!isMuted) {
      const timer = setTimeout(() => {
        speakText(question.questionText, { rate: 0.95 });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pageNumber, difficulty]);

  // Read question text again
  const handleReadQuestionAgain = () => {
    sfx.playPop();
    speakText(question.questionText, { rate: 0.95 });
  };

  // Determine configuration based on difficulty
  const getLevelConfig = () => {
    switch (difficulty) {
      case 1:
        return question.level1;
      case 2:
        return question.level2;
      case 3:
        return question.level3;
      default:
        return question.level1;
    }
  };

  const levelConfig = getLevelConfig();

  // Handle Level 1-3 tile selection
  const handleSelectOption = (option: string) => {
    sfx.playPop();
    if (status === 'correct') return;

    const numBlanksNeeded = levelConfig.correctAnswers.length;
    if (filledBlanks.length < numBlanksNeeded) {
      const updated = [...filledBlanks, option];
      setFilledBlanks(updated);

      // If all blanks are filled, validate immediately
      if (updated.length === numBlanksNeeded) {
        validateAnswer(updated);
      }
    }
  };

  // Handle removing a filled blank
  const handleRemoveBlank = (index: number) => {
    sfx.playPop();
    if (status === 'correct') return;
    const updated = filledBlanks.filter((_, idx) => idx !== index);
    setFilledBlanks(updated);
    setStatus('idle');
    setFeedbackMessage(null);
  };

  // Handle Level 4 Chunk selection
  const handleSelectChunk = (chunk: string) => {
    sfx.playPop();
    if (status === 'correct') return;
    const updated = [...placedChunks, chunk];
    setPlacedChunks(updated);

    if (updated.length === question.level4Chunks.length) {
      validateLevel4(updated);
    }
  };

  const handleRemoveChunk = (index: number) => {
    sfx.playPop();
    if (status === 'correct') return;
    setPlacedChunks(placedChunks.filter((_, idx) => idx !== index));
    setStatus('idle');
    setFeedbackMessage(null);
  };

  // Handle Level 5 Word selection
  const handleSelectWord = (word: string) => {
    sfx.playPop();
    if (status === 'correct') return;
    const updated = [...placedWords, word];
    setPlacedWords(updated);
  };

  const handleRemoveWord = (index: number) => {
    sfx.playPop();
    if (status === 'correct') return;
    setPlacedWords(placedWords.filter((_, idx) => idx !== index));
    setStatus('idle');
    setFeedbackMessage(null);
  };

  // Validation routines
  const validateAnswer = (userBlanks: string[]) => {
    const isAllCorrect = userBlanks.every(
      (ans, i) => ans.trim().toLowerCase() === levelConfig.correctAnswers[i].trim().toLowerCase()
    );

    if (isAllCorrect) {
      handleSuccess();
    } else {
      handleFailure();
    }
  };

  const validateLevel4 = (chunks: string[]) => {
    const isCorrect = chunks.join(' ') === question.level4Chunks.join(' ');
    if (isCorrect) {
      handleSuccess();
    } else {
      handleFailure();
    }
  };

  const validateLevel5 = () => {
    const userSentence = placedWords.join(' ').trim().toLowerCase().replace(/[.,]/g, '');
    const correctSentence = question.fullAnswer.trim().toLowerCase().replace(/[.,]/g, '');

    if (userSentence === correctSentence) {
      handleSuccess();
    } else {
      handleFailure();
    }
  };

  const handleSuccess = () => {
    sfx.playCorrect();
    setStatus('correct');
    setFeedbackMessage('Nice! Correct answer! 🎉');

    // Trigger Read-Along session after short celebratory flash
    setTimeout(() => {
      setShowReadAlong(true);
    }, 750);
  };

  const handleFailure = () => {
    sfx.playIncorrect();
    setStatus('incorrect');
    setAttempts((prev) => prev + 1);
    setShowHint(true);
    setFeedbackMessage('Not quite! Try again.');
  };

  const handleRevealAnswer = () => {
    sfx.playPop();
    setRevealed(true);
    if (difficulty <= 3) {
      setFilledBlanks([...levelConfig.correctAnswers]);
    } else if (difficulty === 4) {
      setPlacedChunks([...question.level4Chunks]);
    } else {
      setPlacedWords(question.fullAnswer.split(' '));
    }
    handleSuccess();
  };

  const handleReadAlongComplete = () => {
    setShowReadAlong(false);
    onAnswerComplete(attempts === 0 && !revealed, attempts + 1);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 sm:py-6 flex flex-col min-h-[calc(100vh-4rem)] justify-between">
      {/* Top Header info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-slate-800 bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-200">
            Page {pageNumber} / {totalPages}
          </span>
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
            Level {difficulty} Question
          </span>
        </div>
      </div>

      {/* Character Inquiry Box */}
      <div className="bg-white rounded-3xl p-5 border border-amber-200/90 shadow-sm mb-4">
        {/* Character asking header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-xs">
            {question.character.avatarIcon}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-sm">
                {question.character.name}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                ({question.character.role})
              </span>
            </div>
            <p className="text-xs text-amber-800 font-medium">
              asks you a question:
            </p>
          </div>
        </div>

        {/* Question Text in Large, Clear font */}
        <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 tracking-tight leading-snug">
          "{question.questionText}"
        </h2>
      </div>

      {/* Response Sentence Area with Blanks */}
      <div
        className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-300 shadow-sm mb-4 ${
          status === 'correct'
            ? 'border-emerald-500 bg-emerald-50/40 ring-4 ring-emerald-200/50'
            : status === 'incorrect'
            ? 'border-red-400 bg-red-50/20'
            : 'border-slate-200/90'
        }`}
      >
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Your Response Sentence:
        </div>

        {/* Difficulty 1, 2, 3: Fill in the Blanks */}
        {difficulty <= 3 && (
          <div className="text-base sm:text-lg font-medium leading-relaxed text-slate-900 flex flex-wrap items-center gap-2">
            {levelConfig.template.map((part, pIdx) => {
              const hasBlankAfter = pIdx < levelConfig.correctAnswers.length;
              const filledValue = filledBlanks[pIdx];

              return (
                <React.Fragment key={pIdx}>
                  <span>{part}</span>
                  {hasBlankAfter && (
                    <button
                      onClick={() => filledValue && handleRemoveBlank(pIdx)}
                      className={`min-w-[72px] h-10 px-3 rounded-xl border-2 font-bold text-sm sm:text-base transition-all inline-flex items-center justify-center ${
                        filledValue
                          ? status === 'correct'
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-400 shadow-xs'
                            : status === 'incorrect'
                            ? 'bg-red-100 text-red-950 border-red-400'
                            : 'bg-amber-100 text-amber-950 border-amber-400 shadow-xs'
                          : 'border-dashed border-amber-400 bg-amber-50/50 text-slate-400 hover:bg-amber-100/50'
                      }`}
                      title={filledValue ? 'Tap to clear' : 'Tap an option below'}
                    >
                      {filledValue || '______'}
                    </button>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Difficulty 4: Sentence Chunks Builder */}
        {difficulty === 4 && (
          <div>
            <div className="min-h-[56px] p-3 rounded-2xl bg-amber-50/60 border border-dashed border-amber-300 flex flex-wrap gap-2 items-center mb-3">
              {placedChunks.length === 0 ? (
                <span className="text-slate-400 text-sm italic">
                  Tap the sentence chunks below in the correct order...
                </span>
              ) : (
                placedChunks.map((chunk, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRemoveChunk(idx)}
                    className="px-3 py-1.5 rounded-xl bg-amber-200 text-amber-950 font-semibold text-sm border border-amber-300 hover:bg-amber-300 transition-colors shadow-xs"
                    title="Tap to remove"
                  >
                    {chunk}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Difficulty 5: Full Sentence Construction */}
        {difficulty === 5 && (
          <div>
            <div className="min-h-[64px] p-3 rounded-2xl bg-amber-50/60 border border-dashed border-amber-300 flex flex-wrap gap-1.5 items-center mb-3">
              {placedWords.length === 0 ? (
                <span className="text-slate-400 text-sm italic">
                  Build the sentence from scratch using the words below:
                </span>
              ) : (
                placedWords.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRemoveWord(idx)}
                    className="px-2.5 py-1 rounded-lg bg-amber-200 text-amber-950 font-semibold text-sm border border-amber-300 hover:bg-amber-300 transition-colors"
                    title="Tap to remove"
                  >
                    {word}
                  </button>
                ))
              )}
            </div>

            {placedWords.length > 0 && status !== 'correct' && (
              <div className="flex justify-end gap-2 mb-2">
                <button
                  onClick={() => {
                    sfx.playPop();
                    setPlacedWords([]);
                  }}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 underline"
                >
                  Clear all
                </button>
                <button
                  onClick={validateLevel5}
                  className="px-4 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-xs"
                >
                  Check Sentence
                </button>
              </div>
            )}
          </div>
        )}

        {/* Feedback Banner */}
        {feedbackMessage && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
              status === 'correct'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-red-100 text-red-900 border border-red-300'
            }`}
          >
            {status === 'correct' ? (
              <Check className="w-4 h-4 text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
            )}
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Hint Box (Gentle Nudge) */}
        {showHint && status !== 'correct' && (
          <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs sm:text-sm text-amber-950">
            <span className="font-bold">💡 Hint: </span>
            <span>{question.hint}</span>
          </div>
        )}

        {/* Reveal Answer if stuck */}
        {attempts >= 2 && status !== 'correct' && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Need some help?</span>
            <button
              onClick={handleRevealAnswer}
              className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 text-xs font-bold flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Show Correct Answer</span>
            </button>
          </div>
        )}
      </div>

      {/* Word Options Bank (Selection Area) */}
      <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/90 mb-4">
        <div className="text-xs font-bold text-slate-600 mb-2">
          {difficulty <= 3
            ? 'Tap a word to fill the blank:'
            : difficulty === 4
            ? 'Tap the phrase chunks in order:'
            : 'Tap words to build your sentence:'}
        </div>

        {/* Difficulty 1-3 Options */}
        {difficulty <= 3 && (
          <div className="flex flex-wrap gap-2">
            {levelConfig.options.map((opt, oIdx) => {
              const isAlreadySelected = filledBlanks.includes(opt);
              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isAlreadySelected || status === 'correct'}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-sm sm:text-base font-bold transition-all border ${
                    isAlreadySelected
                      ? 'bg-slate-200 text-slate-400 border-slate-300 opacity-60'
                      : 'bg-white hover:bg-amber-50 text-slate-900 border-slate-300 hover:border-amber-400 shadow-xs active:scale-95'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* Difficulty 4 Options (Chunks) */}
        {difficulty === 4 && (
          <div className="flex flex-wrap gap-2">
            {/* Scramble chunks cleanly for the learner */}
            {[...question.level4Chunks]
              .sort((a, b) => a.localeCompare(b))
              .map((chunk, cIdx) => {
                const countPlaced = placedChunks.filter((p) => p === chunk).length;
                const countTotal = question.level4Chunks.filter((p) => p === chunk).length;
                const isAllUsed = countPlaced >= countTotal;

                return (
                  <button
                    key={cIdx}
                    onClick={() => handleSelectChunk(chunk)}
                    disabled={isAllUsed || status === 'correct'}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                      isAllUsed
                        ? 'bg-slate-200 text-slate-400 border-slate-300 opacity-60'
                        : 'bg-white hover:bg-amber-50 text-slate-900 border-slate-300 hover:border-amber-400 shadow-xs'
                    }`}
                  >
                    {chunk}
                  </button>
                );
              })}
          </div>
        )}

        {/* Difficulty 5 Options (Word Bank) */}
        {difficulty === 5 && (
          <div className="flex flex-wrap gap-1.5">
            {question.level5WordBank.map((word, wIdx) => {
              const countPlaced = placedWords.filter((p) => p === word).length;
              const countTotal = question.level5WordBank.filter((p) => p === word).length;
              const isAllUsed = countPlaced >= countTotal;

              return (
                <button
                  key={wIdx}
                  onClick={() => handleSelectWord(word)}
                  disabled={isAllUsed || status === 'correct'}
                  className={`min-h-[40px] px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                    isAllUsed
                      ? 'bg-slate-200 text-slate-400 border-slate-300 opacity-60'
                      : 'bg-white hover:bg-amber-50 text-slate-900 border-slate-300 shadow-xs'
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Bar: Read Question Again & Review Story buttons side-by-side (left), Read-Along (right) */}
      <div className="flex items-center justify-between gap-2 pt-2 pb-1 border-t border-amber-200/50">
        <div className="flex items-center gap-2">
          <button
            onClick={handleReadQuestionAgain}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-xs"
          >
            <Volume2 className="w-4 h-4 text-amber-800" />
            <span>Read Again</span>
          </button>

          <button
            onClick={onBackToStory}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-xs"
          >
            <BookOpen className="w-4 h-4 text-amber-800" />
            <span>Review Story</span>
          </button>
        </div>

        {status === 'correct' && (
          <button
            onClick={() => setShowReadAlong(true)}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs shrink-0"
          >
            <span>Read-Along</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Read-Along Modal after correct response */}
      {showReadAlong && (
        <ReadAlongModal
          question={question}
          pageNumber={pageNumber}
          totalPages={totalPages}
          onContinue={handleReadAlongComplete}
          isMuted={isMuted}
        />
      )}
    </div>
  );
};
