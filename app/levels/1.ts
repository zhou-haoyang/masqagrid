import { Level, PieceType } from '../types';

export const LEVEL_1: Level = {
    id: 'level-1',
    width: 20,
    height: 15,
    grid: [
        "MMMA................",
        "MMM.................",
        "MMMD................",
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        "IIIIIIIIIIIIIIIIIIII",
        "IIIIIIIIIIIIIIIIIIII",
        "IIIIIIIIIIIIIIIIIIII",
        "...................."
    ],
    mainSymbols: "🐱🐱🐶🐱🐱🐱🐶🐱🐱",
    allowedSymbols: "🐶",
    disallowedSymbols: "🐶",
    initialPieces: [
        {
            id: 'item-1769878435382-3q52o3b',
            type: PieceType.UNION,
            color: '#3b82f6',
            position: { x: 0, y: 2 },
            shape: [[1,1,1,0],[1,0,1,0],[0,0,0,0]]
        }
    ]
};
