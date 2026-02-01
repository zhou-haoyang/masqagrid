import { Level, PieceType } from '../types';

export default <Level>{
    id: 'level-editor-1769942901831',
    name: 'Sacrifice?',
    width: 7,
    height: 8,
    coveredAllowedSymbolLimit: 1,  // default to 0, adjust as needed
    grid: [
        ".......",
        "..MMM..",
        ".AMMMD.",
        "..MMM..",
        ".......",
        "IIIIIII",
        "IIIIIII",
        "IIIIIII"
    ],
    mainSymbols: "🐶🐶🐶🐶🐱🐶🐶🐶🐶",
    allowedSymbols: "🐱",
    disallowedSymbols: "🐶",
    initialPieces: [
        {
            id: 'item-1769944261768-7cjo2xd',
            type: PieceType.INTERSECT,
            position: { x: 2, y: 6 },
            shape: [[1, 1], [1, 1]]
        },
        {
            id: 'item-1769944275477-y6f2hxe',
            type: PieceType.UNION,
            position: { x: 2, y: 5 },
            shape: [[1, 1, 1], [0, 0, 1], [0, 0, 1]]
        }
    ]
};
