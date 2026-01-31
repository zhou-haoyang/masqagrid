import { Level, Piece, PieceType } from '@/app/types';

export interface ValidationError {
  type:
    | 'missing-main'
    | 'missing-inventory'
    | 'piece-outside-grid'
    | 'empty-shape'
    | 'symbol-mismatch';
  message: string;
  itemId?: string;
}

export interface ValidationWarning {
  type: 'no-allowed' | 'no-disallowed' | 'no-pieces';
  message: string;
  itemId?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

/**
 * Validate a level for common errors and warnings
 */
export function validateLevel(level: Level): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Count cell types
  let mCount = 0, aCount = 0, dCount = 0, iCount = 0;
  level.grid.forEach(row => {
    for (const cell of row) {
      if (cell === 'M') mCount++;
      if (cell === 'A') aCount++;
      if (cell === 'D') dCount++;
      if (cell === 'I') iCount++;
    }
  });

  // Check for required cell types
  if (mCount === 0) {
    errors.push({
      type: 'missing-main',
      message: 'Level must have at least one Main (M) cell',
    });
  }

  if (iCount === 0) {
    errors.push({
      type: 'missing-inventory',
      message: 'Level must have at least one Inventory (I) cell',
    });
  }

  if (aCount === 0) {
    warnings.push({
      type: 'no-allowed',
      message: 'No Allowed (A) cells defined. Players may not understand win conditions.',
    });
  }

  if (dCount === 0) {
    warnings.push({
      type: 'no-disallowed',
      message: 'No Disallowed (D) cells defined. This level may not have clear win conditions.',
    });
  }

  // Check symbol counts match cell counts
  if (level.mainSymbols.length !== mCount) {
    errors.push({
      type: 'symbol-mismatch',
      message: `Main symbols count (${level.mainSymbols.length}) doesn't match M cells (${mCount})`,
    });
  }

  if (level.allowedSymbols.length !== aCount) {
    errors.push({
      type: 'symbol-mismatch',
      message: `Allowed symbols count (${level.allowedSymbols.length}) doesn't match A cells (${aCount})`,
    });
  }

  if (level.disallowedSymbols.length !== dCount) {
    errors.push({
      type: 'symbol-mismatch',
      message: `Disallowed symbols count (${level.disallowedSymbols.length}) doesn't match D cells (${dCount})`,
    });
  }

  // Check pieces are within grid bounds
  for (const piece of level.initialPieces) {
    const pieceWidth = piece.shape[0]?.length || 0;
    const pieceHeight = piece.shape.length;
    
    if (piece.position.x < 0 || piece.position.y < 0 ||
        piece.position.x + pieceWidth > level.width ||
        piece.position.y + pieceHeight > level.height) {
      errors.push({
        type: 'piece-outside-grid',
        message: `Piece "${piece.id}" is positioned outside the grid bounds`,
        itemId: piece.id,
      });
    }
  }

  // Check for empty shapes
  for (const piece of level.initialPieces) {
    if (isShapeEmpty(piece.shape)) {
      errors.push({
        type: 'empty-shape',
        message: `Piece "${piece.id}" has an empty shape`,
        itemId: piece.id,
      });
    }
  }

  if (level.initialPieces.length === 0) {
    warnings.push({
      type: 'no-pieces',
      message: 'No pieces defined. Level may not be playable.',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Check if a shape is empty (all zeros)
 */
function isShapeEmpty(shape: number[][]): boolean {
  return shape.every((row) => row.every((cell) => cell === 0));
}

/**
 * Generate TypeScript code for a level
 */
export function generateLevelCode(level: Level, levelNumber: number | string): string {
  // Format grid
  const gridCode = level.grid
    .map(row => `        "${row}"`)
    .join(',\n');

  // Format pieces
  const piecesCode = level.initialPieces
    .map((piece) => {
      return `        {
            id: '${piece.id}',
            type: PieceType.${piece.type},
            color: '${piece.color}',
            position: { x: ${piece.position.x}, y: ${piece.position.y} },
            shape: ${JSON.stringify(piece.shape)}
        }`;
    })
    .join(',\n');

  return `import { Level, PieceType } from '../types';

export const LEVEL_${levelNumber}: Level = {
    id: '${level.id || `level-${levelNumber}`}',
    width: ${level.width},
    height: ${level.height},
    grid: [
${gridCode}
    ],
    mainSymbols: "${level.mainSymbols}",
    allowedSymbols: "${level.allowedSymbols}",
    disallowedSymbols: "${level.disallowedSymbols}",
    initialPieces: [
${piecesCode}
    ]
};
`;
}

/**
 * Generate instructions for adding level to index
 */
export function generateIndexInstructions(levelNumber: number | string): string {
  return `// Add to /app/levels/index.ts:

import { LEVEL_${levelNumber} } from './${levelNumber}';

// In the LEVELS array, add:
{
  id: '${levelNumber}',
  name: 'Level ${levelNumber}', // Change this to a descriptive name
  level: LEVEL_${levelNumber}
}`;
}
