import { Level, PieceType } from '../types';

export default <Level>{
    id: 'level-0',
    name: 'Test Rendering',
    width: 20,
    height: 15,
    grid: [
        "....................",
        "....................",
        "..MMMMMM..AA........",
        "..MMMMMM............",
        "..MMMMMM............",
        "..MMMMMM............",
        "..MMMMMM..DD........",
        "..MMMMMM............",
        "....................",
        "##..................",
        "##IIIIIIIIIIIIIIII..",
        "..IIIIIIIIIIIIIIII..",
        "..IIIIIIIIIIIIIIII..",
        "..IIIIIIIIIIIIIIII..",
        "...................."
    ],
    mainSymbols: "🐱B🐱C🐱BB🐱C🐱B🐱C🐱B🐱C🐱B🐱C🐱B🐱C🐱B🐱C🐱B🐱C🐱B🐱CX",
    allowedSymbols: "🐱B  ",
    disallowedSymbols: "CX  ",
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
