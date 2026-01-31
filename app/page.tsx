'use client';

import { useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { LevelSelector } from './components/LevelSelector';
import { ThemeToggle } from './components/ThemeToggle';
import { getLevelById, DEFAULT_LEVEL } from './levels';

export default function Home() {
  // State for selected level
  const [selectedLevelId, setSelectedLevelId] = useState(DEFAULT_LEVEL.id);

  // Get current level (with fallback)
  const currentLevelData = getLevelById(selectedLevelId);
  const currentLevel = currentLevelData || DEFAULT_LEVEL.level;

  // Handle level change
  const handleLevelChange = (newLevelId: string) => {
    setSelectedLevelId(newLevelId);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--background)] transition-colors duration-300">
      <div className="fixed bottom-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">Masqagrid</h1>
        {/* <p className="text-gray-500">
          Combine shapes. Mask the grid. Solve the puzzle.
        </p> */}
      </div>

      {/* Level Selector */}
      <LevelSelector
        selectedLevelId={selectedLevelId}
        onLevelChange={handleLevelChange}
      />

      {/* Game Canvas - key prop forces remount on level change */}
      <GameCanvas key={selectedLevelId} level={currentLevel} />

    </main>
  );
}
