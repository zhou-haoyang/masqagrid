'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GameCanvas } from './components/GameCanvas';
import { ThemeToggle } from './components/ThemeToggle';
import { getLevelById, DEFAULT_LEVEL, LEVELS } from './levels';
import { Play, ArrowLeft, Unlock, Lock, RefreshCcw, Info } from 'lucide-react';

const STORAGE_KEY = 'masqagrid_progress';

interface Progress {
  unlockedLevels: string[];
  completedLevels: string[];
  highScores: Record<string, number>;
}

export default function Home() {
  // State for selected level
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [replayKey, setReplayKey] = useState(0);

  // Progress state
  const [progress, setProgress] = useState<Progress>({
    unlockedLevels: [LEVELS[0].id], // First level always unlocked
    completedLevels: [],
    highScores: {}
  });

  const [hasLoaded, setHasLoaded] = useState(false);


  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProgress(prev => ({
          ...prev,
          ...parsed,
          // Ensure highScores exists even if loading old data
          highScores: parsed.highScores || {}
        }));
      } catch (e) {
        console.error('Failed to parse saved progress:', e);
      }
    }
    setHasLoaded(true);
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, hasLoaded]);

  // Get current level (with fallback)
  const currentLevelData = selectedLevelId ? getLevelById(selectedLevelId) : null;
  const currentLevel = currentLevelData || DEFAULT_LEVEL.level;

  // Handle level change
  const handleLevelSelect = (newLevelId: string) => {
    setSelectedLevelId(newLevelId);
    setReplayKey(0);
  };

  // Calculate if there's a next level
  const currentIndex = selectedLevelId ? LEVELS.findIndex(l => l.id === selectedLevelId) : -1;
  const hasNextLevel = currentIndex < LEVELS.length - 1;

  // Mark current level as completed and unlock next level
  const markLevelCompleted = (levelId: string, score: number) => {
    setProgress(prev => {
      const newProgress = { ...prev };

      // Add to completed if not already there
      if (!newProgress.completedLevels.includes(levelId)) {
        newProgress.completedLevels.push(levelId);
      }

      // Update high score
      if (!newProgress.highScores) newProgress.highScores = {};
      const currentHighScore = newProgress.highScores[levelId] || -1;
      if (score > currentHighScore) {
        newProgress.highScores[levelId] = score;
      }

      // Unlock next level
      const levelIndex = LEVELS.findIndex(l => l.id === levelId);
      if (levelIndex < LEVELS.length - 1) {
        const nextLevelId = LEVELS[levelIndex + 1].id;
        if (!newProgress.unlockedLevels.includes(nextLevelId)) {
          newProgress.unlockedLevels.push(nextLevelId);
        }
      }

      return newProgress;
    });
  };

  // Navigate to next level
  const handleNextLevel = () => {
    if (hasNextLevel) {
      const nextLevel = LEVELS[currentIndex + 1];
      setSelectedLevelId(nextLevel.id);
    }
  };

  // Replay current level (force remount)
  const handleReplay = () => {
    // Increment replay key to force GameCanvas remount
    setReplayKey(prev => prev + 1);
  };

  // Back to level selection
  const handleBackToLevels = () => {
    setSelectedLevelId(null);
    setReplayKey(0);
  };

  // Unlock all levels (for testing/debugging)
  const handleUnlockAll = () => {
    setProgress({
      unlockedLevels: LEVELS.map(l => l.id),
      completedLevels: [],
      highScores: progress.highScores || {}
    });
  };

  // Reset all progress
  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset all progress? This will lock all levels except the first one.')) {
      const initialProgress = {
        unlockedLevels: [LEVELS[0].id],
        completedLevels: [],
        highScores: {}
      };
      setProgress(initialProgress);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProgress));
    }
  };

  // Show landing page if no level selected
  if (!selectedLevelId) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--background)] transition-colors duration-300">
        <div className="fixed bottom-4 right-4 z-50">
          <ThemeToggle />
        </div>

        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end">
          {/* Unlock All Button */}
          <button
            onClick={handleUnlockAll}
            className="flex items-center gap-2 px-3 py-2 bg-gray-300 border-2 border-gray-400 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] hover:shadow-[3px_3px_0_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all text-white font-bold text-xs"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            <Unlock size={14} />
            UNLOCK ALL
          </button>

          {/* Reset Progress Button */}
          <button
            onClick={handleResetProgress}
            className="flex items-center gap-2 px-3 py-2 bg-red-400 border-2 border-red-600 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] hover:shadow-[3px_3px_0_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all text-white font-bold text-xs"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            <RefreshCcw size={14} />
            RESET
          </button>
        </div>

        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-[var(--foreground)] mb-4 tracking-tight" style={{ fontFamily: 'var(--font-pixel)' }}>
            MASQAGRID
          </h1>
          <p className="text-lg text-[var(--foreground)] opacity-70 max-w-md mx-auto mb-4">
            Mask symbols with boolean logic pieces to solve puzzles
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--panel-bg)] border-2 border-[var(--panel-border)] shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] hover:shadow-[3px_3px_0_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all text-[var(--panel-text)] font-bold text-sm"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            <Info size={16} />
            ABOUT US
          </Link>
        </div>

        {/* Level Selection Grid */}
        <div className="max-w-4xl w-full">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 text-center uppercase" style={{ fontFamily: 'var(--font-pixel)' }}>
            Select Level
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {LEVELS.map((level, index) => {
              const isUnlocked = progress.unlockedLevels.includes(level.id);
              const isCompleted = progress.completedLevels.includes(level.id);

              return (
                <button
                  key={level.id}
                  onClick={() => isUnlocked && handleLevelSelect(level.id)}
                  disabled={!isUnlocked}
                  className={`group relative border-4 shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] transition-all p-6 flex flex-col items-center gap-3 ${
                    isUnlocked
                      ? 'bg-[var(--panel-bg)] border-[var(--panel-border)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-x-1 active:translate-y-1 cursor-pointer'
                      : 'bg-gray-300 border-gray-500 opacity-50 cursor-not-allowed'
                  }`}
                >
                  {/* Completed Badge */}
                  {isCompleted && (
                    <div className="absolute -top-2 -right-2 bg-green-500 border-2 border-green-700 rounded-full w-6 h-6 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}

                  <div className="text-3xl font-bold text-[var(--panel-text)]" style={{ fontFamily: 'var(--font-pixel)' }}>
                    {index + 1}
                  </div>
                  <div className="text-xs font-bold text-[var(--panel-text)] uppercase text-center" style={{ fontFamily: 'var(--font-pixel)' }}>
                    {level.name}
                  </div>
                  
                  {/* High Score Display */}
                  {isCompleted && progress.highScores?.[level.id] !== undefined && (
                    <div className="mt-1 px-2 py-0.5 bg-yellow-100 border-2 border-yellow-400 text-yellow-800 text-[10px] font-bold uppercase rounded-sm">
                      Best: {progress.highScores[level.id]}
                    </div>
                  )}

                  {isUnlocked ? (
                    <Play className="w-5 h-5 text-[var(--panel-text)] opacity-50 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  // Show game when level is selected
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--background)] transition-colors duration-300">
      <div className="fixed bottom-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Back button */}
      <button
        onClick={handleBackToLevels}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-3 bg-[var(--panel-bg)] border-4 border-[var(--panel-border)] shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all text-[var(--panel-text)] font-bold text-xs uppercase"
        style={{ fontFamily: 'var(--font-pixel)' }}
      >
        <ArrowLeft size={16} />
        Levels
      </button>

      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2" style={{ fontFamily: 'var(--font-pixel)' }}>
          {currentLevelData?.name || 'Masqagrid'}
        </h1>
      </div>

      {/* Game Canvas - key prop forces remount on level change */}
      <GameCanvas
        key={`${selectedLevelId}-${replayKey}`}
        level={currentLevel}
        onNextLevel={handleNextLevel}
        onReplay={handleReplay}
        onBackToLevels={handleBackToLevels}
        onLevelComplete={selectedLevelId ? (score) => markLevelCompleted(selectedLevelId, score) : undefined}
        hasNextLevel={hasNextLevel}
        highScore={selectedLevelId ? progress.highScores[selectedLevelId] : undefined}
      />

    </main>
  );
}
