import { Level, PieceType } from '../types';

export default <Level>{
    id: '14',
    name: 'Runes',
    width: 12,
    height: 13,
    coveredAllowedSymbolLimit: 0,  // default to 0, adjust as needed
    grid: [
        "############",
        "#MMMMMM#####",
        "#MM#MMM#MMM#",
        "#MMaMMM#MdM#",
        "#MM#MMM#MMM#",
        "############",
        "IIIIIIIIIIII",
        "IIIIIIIIIIII",
        "IIIIIIIIIIII",
        "IIIIIIIIIIII",
        "IIIIIIIIIIII",
        "IIIIIIIIIIII",
        "IIIIIIIIIIII"
    ],
    mainSymbols: "💣💎💣💣💣💣💎💎💎💣💎💣💎💎💣💎💣💣💣💎💣💣💣💣💎💎💣💣💣",
    allowedSymbols: "💎",
    disallowedSymbols: "💣",
    initialPieces: [
        {
            id: 'item-1769951712698-lq403ry',
            type: PieceType.INTERSECT,
            position: { x: 3, y: 9 },
            shape: [[0, 1, 0, 0, 0, 0], [1, 1, 1, 0, 1, 0], [0, 0, 1, 0, 1, 1], [1, 1, 1, 1, 1, 0]]
        },
        {
            id: 'item-1769951820894-rwz9li1',
            type: PieceType.UNION,
            position: { x: 1, y: 7 },
            shape: [[0, 1, 1, 0], [0, 0, 1, 0], [1, 1, 1, 0], [0, 1, 0, 0], [1, 1, 1, 1]]
        },
        {
            id: 'item-1769951907197-a1jo4o5',
            type: PieceType.XOR,
            position: { x: 6, y: 8 },
            shape: [[1, 0, 1, 0, 0], [1, 1, 1, 0, 1], [1, 0, 1, 1, 1], [1, 0, 0, 0, 0]]
        }
    ]
};
