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
            id: 'p4',
            type: PieceType.INTERSECT,
            color: '#fbbf24', // amber-400
            position: { x: 2, y: 11 },
            shape: [
                [1],
                [1],
                [1]
            ]
        },
        {
            id: 'p6',
            type: PieceType.INTERSECT,
            color: '#fbbf24', // amber-400
            position: { x: 4, y: 11 },
            shape: [
                [1],
                [1],
                [1]
            ]
        },
        {
            id: 'p1',
            type: PieceType.UNION,
            color: '#3b82f6', // blue-500
            position: { x: 6, y: 11 },
            shape: [
                [1, 1],
                [1, 0]
            ]
        },
        {
            id: 'p2',
            type: PieceType.UNION,
            color: '#3b82f6', // blue-500
            position: { x: 9, y: 11 },
            shape: [
                [1, 1, 1],
                [0, 1, 0]
            ]
        },
        {
            id: 'p3',
            type: PieceType.XOR,
            color: '#ef4444', // red-500
            position: { x: 13, y: 11 },
            shape: [
                [1, 1],
                [1, 1]
            ]
        },
        {
            id: 'p5',
            type: PieceType.XOR,
            color: '#ef4444', // red-500
            position: { x: 16, y: 11 },
            shape: [
                [1, 0],
                [1, 0],
                [1, 1]
            ]
        }
    ]
};
