import { Level, PieceType } from '../types';

export default <Level>{
    id: '003',
    name: 'Multiplicity',
    width: 10,
    height: 10,
    grid: [
        "..........",
        "..MMM.....",
        "...MM.....",
        "..MMMM..D.",
        "..MMMMM...",
        ".MMMMMM...",
        "..........",
        "IIIIIIIIII",
        "IIIIIIIIII",
        "IIIIIIIIII"
    ],
    mainSymbols: "🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶",
    allowedSymbols: "",
    disallowedSymbols: "🐶",
    initialPieces: [
        {
            id: 'item-1769892382634-5ggp7rw',
            type: PieceType.BLOCKER,
            position: { x: 2, y: 8 },
            shape: [[1, 1, 1], [0, 0, 1]]
        },
        {
            id: 'item-1769892410872-kn0umii',
            type: PieceType.BLOCKER,
            position: { x: 1, y: 8 },
            shape: [[1, 0, 0], [1, 1, 1]]
        },
        {
            id: 'item-1769892415691-4evlncr',
            type: PieceType.BLOCKER,
            position: { x: 6, y: 8 },
            shape: [[1, 1, 1], [0, 0, 1]]
        },
        {
            id: 'item-1769892418480-665h25l',
            type: PieceType.BLOCKER,
            position: { x: 5, y: 8 },
            shape: [[1, 0, 0], [1, 1, 1]]
        },
        {
            id: 'item-1769892436173-18iql0x',
            type: PieceType.BLOCKER,
            position: { x: 0, y: 7 },
            shape: [[1, 1], [1, 0], [1, 0]]
        }
    ]
};
