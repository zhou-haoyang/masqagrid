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
    <div className="mb-4 flex items-center gap-3">
      <label htmlFor="level-select" className="text-sm font-medium text-gray-700">
        Select Level:
      </label>
      <select
        id="level-select"
        value={selectedLevelId}
        onChange={(e) => onLevelChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
      >
        {LEVELS.map((level) => (
          <option key={level.id} value={level.id}>
            {LEVELS.findIndex((l) => l.id === level.id)}. {level.name}
          </option>
        ))}
      </select>
    </div>
  );
};
