import React, { useState, useEffect } from 'react';
import { DifficultyLevel, StoryProgress } from './types';
import { STORY_PAGES } from './data/storyData';
import { Header } from './components/Header';
import { CoverScreen } from './components/CoverScreen';
import { StoryPageScreen } from './components/StoryPageScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { ResultScreen } from './components/ResultScreen';

export default function App() {
  const [viewMode, setViewMode] = useState<'cover' | 'story' | 'question' | 'result'>('cover');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [progress, setProgress] = useState<StoryProgress>({
    currentPage: 1,
    score: 0,
    answersHistory: [],
    difficulty: 1,
    userReaction: null,
    completed: false,
  });

  // Restore difficulty preference if saved
  useEffect(() => {
    try {
      const savedDiff = localStorage.getItem('storywalk_difficulty');
      if (savedDiff) {
        const parsed = parseInt(savedDiff, 10);
        if (parsed >= 1 && parsed <= 5) {
          setDifficulty(parsed as DifficultyLevel);
          setProgress((prev) => ({ ...prev, difficulty: parsed as DifficultyLevel }));
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleSelectDifficulty = (level: DifficultyLevel) => {
    setDifficulty(level);
    setProgress((prev) => ({ ...prev, difficulty: level }));
    try {
      localStorage.setItem('storywalk_difficulty', level.toString());
    } catch {}
  };

  const handleStartStory = () => {
    setCurrentPageIndex(0);
    setProgress({
      currentPage: 1,
      score: 0,
      answersHistory: [],
      difficulty: difficulty,
      userReaction: null,
      completed: false,
    });
    setViewMode('story');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToQuestion = () => {
    setViewMode('question');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToStory = () => {
    setViewMode('story');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswerComplete = (firstTry: boolean, attempts: number) => {
    const pageNum = currentPageIndex + 1;
    const isNewScore = firstTry;

    setProgress((prev) => ({
      ...prev,
      score: isNewScore ? prev.score + 1 : prev.score,
      answersHistory: [
        ...prev.answersHistory,
        {
          pageNumber: pageNum,
          firstTryCorrect: firstTry,
          attempts,
          answeredAt: Date.now(),
        },
      ],
    }));

    if (currentPageIndex < STORY_PAGES.length - 1) {
      setCurrentPageIndex((prev) => prev + 1);
      setViewMode('story');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Finished all 10 pages!
      setProgress((prev) => ({ ...prev, completed: true }));
      setViewMode('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRestartStory = (newDifficulty?: DifficultyLevel) => {
    if (newDifficulty) {
      handleSelectDifficulty(newDifficulty);
      setCurrentPageIndex(0);
      setProgress({
        currentPage: 1,
        score: 0,
        answersHistory: [],
        difficulty: newDifficulty,
        userReaction: null,
        completed: false,
      });
      setViewMode('story');
    } else {
      setViewMode('cover');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentPageData = STORY_PAGES[currentPageIndex] || STORY_PAGES[0];

  return (
    <div className="min-h-screen bg-amber-50/40 text-slate-900 font-sans flex flex-col selection:bg-amber-200">
      {/* Top Application Header */}
      <Header
        currentPage={viewMode === 'cover' ? undefined : currentPageIndex + 1}
        totalPages={STORY_PAGES.length}
        difficulty={difficulty}
        onHomeClick={() => setViewMode('cover')}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
      />

      {/* Main Body Canvas */}
      <main className="grow flex flex-col justify-start pb-10">
        {viewMode === 'cover' && (
          <CoverScreen
            difficulty={difficulty}
            onSelectDifficulty={handleSelectDifficulty}
            onStartStory={handleStartStory}
          />
        )}

        {viewMode === 'story' && (
          <StoryPageScreen
            key={`story-${currentPageData.pageNumber}`}
            page={currentPageData}
            totalPages={STORY_PAGES.length}
            onGoToQuestion={handleGoToQuestion}
            isMuted={isMuted}
          />
        )}

        {viewMode === 'question' && (
          <QuestionScreen
            key={`question-${currentPageData.pageNumber}-${difficulty}`}
            question={currentPageData.question}
            pageNumber={currentPageData.pageNumber}
            totalPages={STORY_PAGES.length}
            difficulty={difficulty}
            onAnswerComplete={handleAnswerComplete}
            onBackToStory={handleBackToStory}
            isMuted={isMuted}
          />
        )}

        {viewMode === 'result' && (
          <ResultScreen
            progress={progress}
            totalPages={STORY_PAGES.length}
            onRestartStory={handleRestartStory}
            onUpdateDifficulty={handleSelectDifficulty}
          />
        )}
      </main>
    </div>
  );
}
