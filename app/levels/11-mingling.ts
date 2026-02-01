import { Level, PieceType } from '../types';

export default <Level>{
    id: 'mingling',
    name: 'Mingling',
    width: 9,
    height: 12,
    grid: [
        "###MMM###",
        "#a#MMM#d#",
        "###MMM###",
        "MMMMMMMMM",
        "MMMMMMMMM",
        "MMMMMMMMM",
        "IIIIIIIII",
        "IIIIIIIII",
        "IIIIIIIII",
        "IIIIIIIII",
        "IIIIIIIII",
        "IIIIIIIII"
    ],
    mainSymbols: "🐱🐱🐱🐱🐱🐶🐱🐶🐶🐶🐶🐶🐱🐱🐱🐶🐶🐱🐶🐱🐱🐶🐱🐱🐶🐶🐱🐶🐱🐶🐶🐱🐶🐶🐱🐶",
    allowedSymbols: "🐱",
    disallowedSymbols: "🐶",
    coveredAllowedSymbolLimit: 8,  // got from playtesting
    initialPieces: [
        {
            id: 'item-1769903950179-ijt3awf',
            type: PieceType.UNION,
            position: { x: 6, y: 6 },
            shape: [[1,1,1],[1,1,1],[1,1,1]]
        },
        {
            id: 'item-1769903970893-zp2pevz',
            type: PieceType.XOR,
            position: { x: 0, y: 6 },
            shape: [[1,1,1],[1,1,1],[1,1,1]]
        },
        {
            id: 'item-1769904010139-raysgg6',
            type: PieceType.INTERSECT,
            position: { x: 3, y: 6 },
            shape: [[1,1,1],[1,1,1],[1,1,1]]
        },
        {
            id: 'item-1769904056648-lxtlv1q',
            type: PieceType.XOR,
            position: { x: 6, y: 9 },
            shape: [[1,1,1],[1,1,1],[1,1,1]]
        },
        {
            id: 'item-1769904064365-9wwhkdb',
            type: PieceType.INTERSECT,
            position: { x: 0, y: 9 },
            shape: [[1,1,1],[1,1,1],[1,1,1]]
        },
        {
            id: 'item-1769904068102-5k4nfq5',
            type: PieceType.UNION,
            position: { x: 3, y: 9 },
            shape: [[1,1,1],[1,1,1],[1,1,1]]
        }
    ]
};
