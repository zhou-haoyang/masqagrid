import { Level, Region, Piece, PieceType } from '@/app/types';

export interface ValidationError {
  type:
    | 'missing-main'
    | 'missing-inventory'
    | 'piece-outside-inventory'
    | 'overlapping-regions'
    | 'empty-shape'
    | 'invalid-symbols';
  message: string;
  itemId?: string;
}

export interface ValidationWarning {
  type: 'no-allowed' | 'no-disallowed' | 'empty-symbols';
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

  // Check for required regions
  const hasMain = level.regions.some((r) => r.type === 'MAIN');
  const hasInventory = level.regions.some((r) => r.type === 'INVENTORY');
  const hasAllowed = level.regions.some((r) => r.type === 'ALLOWED');
  const hasDisallowed = level.regions.some((r) => r.type === 'DISALLOWED');

  if (!hasMain) {
    errors.push({
      type: 'missing-main',
      message: 'Level must have at least one MAIN region',
    });
  }

  if (!hasInventory) {
    errors.push({
      type: 'missing-inventory',
      message: 'Level must have at least one INVENTORY region',
    });
  }

  if (!hasAllowed) {
    warnings.push({
      type: 'no-allowed',
      message: 'No ALLOWED region defined. Players may not understand win conditions.',
    });
  }

  if (!hasDisallowed) {
    warnings.push({
      type: 'no-disallowed',
      message: 'No DISALLOWED region defined. This level may not have clear win conditions.',
    });
  }

  // Check pieces are in inventory
  const inventoryRegions = level.regions.filter((r) => r.type === 'INVENTORY');
  for (const piece of level.initialPieces) {
    const pieceRect = {
      x: piece.position.x,
      y: piece.position.y,
      width: piece.shape[0]?.length || 0,
      height: piece.shape.length,
    };

    const inInventory = inventoryRegions.some((inv) => isRectInside(pieceRect, inv));

    if (!inInventory) {
      errors.push({
        type: 'piece-outside-inventory',
        message: `Piece "${piece.id}" is not positioned within an INVENTORY region`,
        itemId: piece.id,
      });
    }
  }

  // Check for overlapping regions
  for (let i = 0; i < level.regions.length; i++) {
    for (let j = i + 1; j < level.regions.length; j++) {
      if (doRegionsOverlap(level.regions[i], level.regions[j])) {
        errors.push({
          type: 'overlapping-regions',
          message: `Regions "${level.regions[i].id}" and "${level.regions[j].id}" overlap`,
          itemId: level.regions[i].id,
        });
      }
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

  // Check symbol grid dimensions match region dimensions
  for (const region of level.regions) {
    if (region.symbols) {
      const symbolHeight = region.symbols.length;
      const symbolWidth = region.symbols[0]?.length || 0;

      if (symbolHeight !== region.height || symbolWidth !== region.width) {
        errors.push({
          type: 'invalid-symbols',
          message: `Region "${region.id}" symbol grid (${symbolWidth}×${symbolHeight}) doesn't match region size (${region.width}×${region.height})`,
          itemId: region.id,
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Check if a rectangle is fully inside a region
 */
function isRectInside(
  rect: { x: number; y: number; width: number; height: number },
  container: Region
): boolean {
  return (
    rect.x >= container.x &&
    rect.y >= container.y &&
    rect.x + rect.width <= container.x + container.width &&
    rect.y + rect.height <= container.y + container.height
  );
}

/**
 * Check if two regions overlap
 */
function doRegionsOverlap(r1: Region, r2: Region): boolean {
  return !(
    r1.x + r1.width <= r2.x ||
    r2.x + r2.width <= r1.x ||
    r1.y + r1.height <= r2.y ||
    r2.y + r2.height <= r1.y
  );
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
  // Format regions
  const regionsCode = level.regions
    .map((region) => {
      const symbolsCode = region.symbols
        ? `,\n    symbols: ${formatSymbolGrid(region.symbols)}`
        : '';

      return `  {
    id: '${region.id}',
    type: '${region.type}',
    x: ${region.x},
    y: ${region.y},
    width: ${region.width},
    height: ${region.height}${symbolsCode}
  }`;
    })
    .join(',\n');

  // Format pieces
  const piecesCode = level.initialPieces
    .map((piece) => {
      return `  {
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
  regions: [
${regionsCode}
  ],
  initialPieces: [
${piecesCode}
  ]
};
`;
}

/**
 * Format symbol grid for code generation
 */
function formatSymbolGrid(symbols: string[][]): string {
  const rows = symbols.map((row) => {
    const cells = row.map((cell) => `'${cell}'`).join(', ');
    return `[${cells}]`;
  });
  return `[\n      ${rows.join(',\n      ')}\n    ]`;
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
