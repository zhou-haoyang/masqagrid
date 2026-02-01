import { Level, PieceType } from '../types';

export default <Level>{
    id: '99',
    name: 'testing',
    width: 15,
    height: 13,
    coveredAllowedSymbolLimit: 0,  // default to 0, adjust as needed
    grid: [
        "DMI............",
        "...............",
        "...............",
        "...............",
        "...............",
        "...............",
        "...............",
        "...............",
        "...............",
        "...............",
        "...............",
        "...............",
        "..............I"
    ],
    mainSymbols: "A",
    allowedSymbols: "",
    disallowedSymbols: "A",
    initialPieces: [
        {
            id: 'item-1769951712698-lq403ry',
            type: PieceType.INTERSECT,
            position: { x: 2, y: 9 },
            shape: [[0, 1, 0, 0, 0, 0], [1, 1, 1, 0, 1, 0], [0, 0, 1, 0, 1, 1], [1, 1, 1, 1, 1, 0]]
        },
        {
            id: 'item-1769951820894-rwz9li1',
            type: PieceType.UNION,
            position: { x: 0, y: 7 },
            shape: [[0, 1, 1, 0], [0, 0, 1, 0], [1, 1, 1, 0], [0, 1, 0, 0], [1, 1, 1, 1]]
        },
        {
            id: 'item-1769951907197-a1jo4o5',
            type: PieceType.XOR,
            position: { x: 5, y: 8 },
            shape: [[1, 0, 1, 0, 0], [1, 1, 1, 0, 1], [1, 0, 1, 1, 1], [1, 0, 0, 0, 0]]
        }
    ]
};
