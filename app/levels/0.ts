import { Level, PieceType } from '../types';

export const LEVEL_0: Level = {
    id: 'level-1',
    width: 20,
    height: 15,
    regions: [
        {
            id: 'main-grid',
            type: 'MAIN',
            x: 2,
            y: 2,
            width: 6,
            height: 6,
            symbols: [
                ['A', 'B', 'A', 'C', 'A', 'B'],
                ['B', 'A', 'C', 'A', 'B', 'A'],
                ['A', 'C', 'A', 'B', 'A', 'C'],
                ['C', 'A', 'B', 'A', 'C', 'A'],
                ['A', 'B', 'A', 'C', 'A', 'B'],
                ['B', 'A', 'C', 'A', 'B', 'A'],
            ]
        },
        {
            id: 'allowed-symbols',
            type: 'ALLOWED',
            x: 10,
            y: 2,
            width: 4,
            height: 2,
            symbols: [
                ['A', 'B'],
                [' ', ' '], // Spacer
            ]
        },
        {
            id: 'disallowed-symbols',
            type: 'DISALLOWED',
            x: 10,
            y: 6,
            width: 4,
            height: 2,
            symbols: [
                ['C', 'X'],
                [' ', ' '],
            ]
        },
        {
            id: 'inventory',
            type: 'INVENTORY',
            x: 2,
            y: 10,
            width: 16,
            height: 4,
            // No fixed symbols, just a region
        }
    ],
    initialPieces: [
        // Spaced out inventory: x=2, 4, 6, 9, 13, 16 
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
