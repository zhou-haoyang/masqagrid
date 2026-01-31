import { PieceType } from '../types';

export const PIECE_COLORS: Record<PieceType, string> = {
    [PieceType.UNION]: '#0EA5E9',      // Bright Sky Blue
    [PieceType.XOR]: '#EF4444',        // Bright Red
    [PieceType.INTERSECT]: '#EAB308',  // Bright Gold
    [PieceType.BLOCKER]: '#1f2937',    // Obsidian/Bedrock Black
};

/**
 * Returns the hex color for a given PieceType.
 */
export function getPieceColor(type: PieceType): string {
    return PIECE_COLORS[type] || PIECE_COLORS[PieceType.BLOCKER];
}
