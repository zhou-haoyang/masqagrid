'use client';

import { useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { LevelSelector } from './components/LevelSelector';
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
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Masqagrid</h1>
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
