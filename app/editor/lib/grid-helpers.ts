import { Position } from '@/app/types';

export const CELL_SIZE = 40; // Match GameCanvas constant

/**
 * Convert pixel coordinates to grid coordinates
 */
export function pixelToGrid(
  pixelX: number,
  pixelY: number,
  containerRect: DOMRect
): Position {
  const relativeX = pixelX - containerRect.left;
  const relativeY = pixelY - containerRect.top;
  return {
    x: Math.floor(relativeX / CELL_SIZE),
    y: Math.floor(relativeY / CELL_SIZE),
  };
}

/**
 * Convert grid coordinates to pixel coordinates
 */
export function gridToPixel(gridX: number, gridY: number): Position {
  return {
    x: gridX * CELL_SIZE,
    y: gridY * CELL_SIZE,
  };
}

/**
 * Snap pixel coordinates to nearest grid position
 */
export function snapToGrid(pixelX: number, pixelY: number): Position {
  return {
    x: Math.round(pixelX / CELL_SIZE) * CELL_SIZE,
    y: Math.round(pixelY / CELL_SIZE) * CELL_SIZE,
  };
}

/**
 * Check if a position is within bounds
 */
export function isInBounds(
  position: Position,
  width: number,
  height: number
): boolean {
  return (
    position.x >= 0 &&
    position.y >= 0 &&
    position.x < width &&
    position.y < height
  );
}

/**
 * Generate a unique ID
 */
export function generateId(prefix: string = 'item'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
