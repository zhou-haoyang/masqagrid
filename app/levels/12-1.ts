import { Level, PieceType } from '../types';

export default <Level>{
    id: '21',
    name: 'Perfect Fit',
    width: 13,
    height: 8,
    coveredAllowedSymbolLimit: 0,  // default to 0, adjust as needed
    grid: [
        "#############",
        "#Ad######MMI#",
        "####I#II#MMI#",
        "#I#II#II#III#",
        "#############",
        "#M##M##M##M##",
        "#MM##M##M##M#",
        "#############"
    ],
    mainSymbols: "🐱🐱🐱🐱🐶🐶🐶🐶🐶🐶🐶🐶🐶",
    allowedSymbols: "🐱",
    disallowedSymbols: "🐶",
    initialPieces: [
        {
            id: 'item-1769957239381-2tuavkt',
            type: PieceType.UNION,
            position: { x: 6, y: 2 },
            shape: [[1, 1], [1, 1]]
        },
        {
            id: 'item-1769957250491-28r6mqi',
            type: PieceType.INTERSECT,
            position: { x: 9, y: 1 },
            shape: [[0, 0, 1], [0, 0, 1], [1, 1, 1]]
        },
        {
            id: 'item-1769957316872-h9h9vre',
            type: PieceType.XOR,
            position: { x: 1, y: 3 },
            shape: [[1]]
        },
        {
            id: 'item-1769957330032-kmfssyr',
            type: PieceType.UNION,
            position: { x: 3, y: 2 },
            shape: [[0, 1], [1, 1]]
        }
    ]
};
