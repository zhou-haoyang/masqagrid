'use client';

import React from 'react';
import { LEVELS } from '../levels';

interface LevelSelectorProps {
  selectedLevelId: string;
  onLevelChange: (levelId: string) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  selectedLevelId,
  onLevelChange,
}) => {
  return (
    <div className="mb-6 flex flex-col items-center gap-2">
      <label htmlFor="level-select" className="text-xs font-bold uppercase text-gray-700 font-pixel">
        Select Level:
      </label>
      <div className="relative">
        <select
          id="level-select"
          value={selectedLevelId}
          onChange={(e) => onLevelChange(e.target.value)}
          className="appearance-none pl-4 pr-10 py-3 bg-white border-4 border-gray-900 shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] text-gray-900 font-bold text-xs uppercase cursor-pointer focus:outline-none hover:translate-y-px hover:shadow-[3px_3px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          {LEVELS.map((level) => (
            <option key={level.id} value={level.id}>
              {level.name}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-t-8 border-t-gray-900 border-x-8 border-x-transparent w-0 h-0"></div>
      </div>
    </div>
  );
};
