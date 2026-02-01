import { Level, PieceType } from '../types';

export default <Level>{
    id: 'level-editor-1769940782336',
    name: 'Claustrophobia',
    width: 7,
    height: 7,
    coveredAllowedSymbolLimit: 0,  // default to 0, adjust as needed
    grid: [
        "#######",
        "#a#d#M#",
        "#MMMMM#",
        "#####M#",
        "IIII#M#",
        "IIII#M#",
        "IIII###"
    ],
    mainSymbols: "🐶🐶🐱🐶🐱🐶🐱🐶🐶",
    allowedSymbols: "🐱",
    disallowedSymbols: "🐶",
    initialPieces: [
        {
            id: 'item-1769941590689-sv599hs',
            type: PieceType.XOR,
            position: { x: 2, y: 4 },
            shape: [[1, 1], [1, 1]]
        },
        {
            id: 'item-1769941713869-pizmaax',
            type: PieceType.UNION,
            position: { x: 0, y: 5 },
            shape: [[1, 1], [1, 0]]
        },
        {
            id: 'item-1769941744152-3krhvhi',
            type: PieceType.INTERSECT,
            position: { x: 1, y: 6 },
            shape: [[1, 1, 1]]
        }
    ]
};
