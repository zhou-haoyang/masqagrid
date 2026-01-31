import { PieceType } from '../types';

export const PIECE_COLORS: Record<PieceType, string> = {
    [PieceType.UNION]: '#3b82f6',      // Blue-500
    [PieceType.XOR]: '#ef4444',        // Red-500
    [PieceType.INTERSECT]: '#fbbf24',  // Amber-400
    [PieceType.BLOCKER]: '#6b7280',    // Gray-500
};

/**
 * Returns the hex color for a given PieceType.
 */
export function getPieceColor(type: PieceType): string {
    return PIECE_COLORS[type] || PIECE_COLORS[PieceType.BLOCKER];
}
