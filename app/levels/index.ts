import { Level } from '../types';

// Level metadata for UI
export interface LevelMetadata {
  id: string;
  name: string;
  level: Level;
}

// Type definition for Webpack's require.context
interface RequireContext {
  keys(): string[];
  (id: string): { default: Level };
}

declare const require: {
  context(
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp
  ): RequireContext;
};

// Automatically import all level files (excluding index.ts)
const levelModules: RequireContext = require.context(
  './',
  false,
  /^\.\/(?!index)[^/]+\.ts$/
);

// Registry of all available levels
export const LEVELS: LevelMetadata[] = levelModules.keys().map((fileName: string) => {
  const level = levelModules(fileName).default;
  return {
    id: level.id,
    name: level.name,
    level: level,
  };
}).sort((a, b) => a.id.localeCompare(b.id));

// Helper to get level by ID
export function getLevelById(id: string): Level | null {
  const found = LEVELS.find(l => l.id === id);
  return found ? found.level : null;
}

// Default level
export const DEFAULT_LEVEL = LEVELS[0];
