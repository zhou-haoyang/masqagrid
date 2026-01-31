import { Level } from '../types';

// Import all level files
import { LEVEL_0 } from './0';
import { LEVEL_1 } from './1';

// Level metadata for UI
export interface LevelMetadata {
  id: string;
  name: string;
  level: Level;
}

// Registry of all available levels
export const LEVELS: LevelMetadata[] = [
  {
    id: '0',
    name: 'Level 0',
    level: LEVEL_0,
  },
  {
    id: '1',
    name: 'Level 1',
    level: LEVEL_1,
  },
];

// Helper to get level by ID
export function getLevelById(id: string): Level | null {
  const found = LEVELS.find(l => l.id === id);
  return found ? found.level : null;
}

// Default level
export const DEFAULT_LEVEL = LEVELS[0];
