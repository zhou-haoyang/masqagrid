'use client';

import React from 'react';
import { Trophy, RotateCcw, ChevronRight } from 'lucide-react';

interface VictoryPanelProps {
  isOpen: boolean;
  score: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
}

export const VictoryPanel: React.FC<VictoryPanelProps> = ({
  isOpen,
  score,
  hasNextLevel,
  onNextLevel,
  onReplay
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative z-10 bg-[var(--panel-bg)] border-8 border-[var(--panel-border)] shadow-[12px_12px_0_0_rgba(0,0,0,1)] p-8 max-w-md">
        {/* Trophy Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-400 border-4 border-yellow-600 p-4 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]">
            <Trophy size={48} className="text-yellow-800" />
          </div>
        </div>

        {/* Victory Message */}
        <h2 className="text-2xl font-bold text-center mb-6 text-[var(--panel-text)] uppercase" style={{ fontFamily: 'var(--font-pixel)' }}>
          Level Complete!
        </h2>

        {/* Score Display */}
        <div className="bg-green-100 border-4 border-green-600 p-4 mb-6 text-center">
          <p className="text-xs uppercase text-green-800 mb-2 font-bold">Final Score</p>
          <p className="text-4xl font-bold text-green-800">{score}</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          {hasNextLevel ? (
            <button
              onClick={onNextLevel}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white hover:bg-blue-700 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 font-bold text-sm uppercase shadow-md transition-all"
            >
              Next Level 
            </button>
          ) : (
            <div className="px-6 py-4 bg-yellow-100 border-4 border-yellow-500 text-center">
              <p className="text-xs font-bold text-yellow-800 uppercase">
                🎉 All Levels Complete! 🎉
              </p>
            </div>
          )}

          <button
            onClick={onReplay}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-200 text-gray-900 hover:bg-gray-300 border-b-4 border-gray-400 active:border-b-0 active:translate-y-1 font-bold text-sm uppercase shadow-md transition-all"
          >
             Replay Level
          </button>
        </div>
      </div>
    </div>
  );
};
