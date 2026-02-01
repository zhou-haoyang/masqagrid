import { Level, PieceType } from '../types';

export default <Level>{
    id: 'one-by-one',
    name: 'One-by-One',
    width: 7,
    height: 7,
    coveredAllowedSymbolLimit: 0,  // default to 0, adjust as needed
    grid: [
        "#######",
        "#MMMaD#",
        "#####a#",
        "##II#M#",
        "#III#M#",
        "II###M#",
        "II#####"
    ],
    mainSymbols: "🐶🐱🐶🐶🐱🐶",
    allowedSymbols: "🐱🐱",
    disallowedSymbols: "🐶",
    initialPieces: [
        {
            id: 'item-1769948607740-uxt4ubb',
            type: PieceType.BLOCKER,
            position: { x: 0, y: 3 },
            shape: [[0, 0, 1], [0, 1, 1], [1, 1, 0]]
        },
        {
            id: 'item-1769948704382-u9lqjit',
            type: PieceType.INTERSECT,
            position: { x: 3, y: 3 },
            shape: [[1], [1]]
        },
        {
            id: 'item-1769948713434-vowttl5',
            type: PieceType.INTERSECT,
            position: { x: 0, y: 6 },
            shape: [[1, 1]]
        }
    ]
};
