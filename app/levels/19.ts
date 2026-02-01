import { Level, PieceType } from '../types';

export default <Level>{
    id: '19',
    name: 'Criss-Cross',
    width: 15,
    height: 7,
    coveredAllowedSymbolLimit: 0,  // default to 0, adjust as needed
    grid: [
        "##########M#M##",
        "IIIIIII###M#M##",
        "IIIIIII#MMMMMMM",
        "IIIIIII###MDM##",
        "IIIIIII#MMMMMMM",
        "IIIaIII###M#M##",
        "##########M#M##"
    ],
    mainSymbols: "🐶🐶🐱🐱🐶🐱🐶🐱🐶🐱🐶🐱🐱🐶🐱🐶🐱🐶🐱🐶🐱🐱🐶🐶",
    allowedSymbols: "🐱",
    disallowedSymbols: "🐶",
    initialPieces: [
        {
            id: 'item-1769958231145-2d7ezc6',
            type: PieceType.UNION,
            position: { x: 0, y: 1 },
            shape: [[1, 1, 1, 1, 1, 1, 1]]
        },
        {
            id: 'item-1769958238110-hbmfvt3',
            type: PieceType.UNION,
            position: { x: 0, y: 2 },
            shape: [[1, 1, 1, 1, 1, 1, 1]]
        },
        {
            id: 'item-1769958240200-74kxez2',
            type: PieceType.UNION,
            position: { x: 0, y: 3 },
            shape: [[1, 1, 1, 1, 1, 1, 1]]
        },
        {
            id: 'item-1769958242410-sklqa6w',
            type: PieceType.UNION,
            position: { x: 0, y: 4 },
            shape: [[1, 1, 1, 1, 1, 1, 1]]
        },
        {
            id: 'item-1769958483838-buzcg7c',
            type: PieceType.INTERSECT,
            position: { x: 0, y: 5 },
            shape: [[1, 1, 1]]
        },
        {
            id: 'item-1769958591954-yh6ifta',
            type: PieceType.INTERSECT,
            position: { x: 4, y: 5 },
            shape: [[1, 1, 1]]
        }
    ]
};
