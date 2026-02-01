import { Level, PieceType } from '../types';

export default <Level>{
    id: 'encircled-2',
    name: 'Encircled 2',
    width: 8,
    height: 12,
    coveredAllowedSymbolLimit: 0,  // default to 0, adjust as needed
    grid: [
        "MMMMMMD#",
        "MMMMMM#D",
        "MMMMMMD#",
        "MMMMMM#D",
        "MMMMMMD#",
        "MMMMMM#D",
        "######A#",
        "IIIIIIII",
        "IIIIIIII",
        "IIIIIIII",
        "IIIIIIII",
        "IIIIIIII"
    ],
    mainSymbols: "🐑🐺🐺🐺🐺🐑🐑🐺🐺🐺🐺🐑🐺🐺🐺🐺🐺🐺🐺🐺🐺🐺🐺🐺🐺🐑🐑🐑🐑🐺🐺🐑🐑🐑🐑🐺",
    allowedSymbols: "🐑",
    disallowedSymbols: "🐺🐺🐺🐺🐺🐺",
    initialPieces: [
        {
            id: 'item-1769955285902-eklb2gq',
            type: PieceType.INTERSECT,
            position: { x: 0, y: 10 },
            shape: [[1,1,1],[1,1,1]]
        },
        {
            id: 'item-1769955292850-c0yhnu7',
            type: PieceType.INTERSECT,
            position: { x: 5, y: 10 },
            shape: [[1,1,1],[1,1,1]]
        },
        {
            id: 'item-1769963699618-tj79s51',
            type: PieceType.XOR,
            position: { x: 1, y: 7 },
            shape: [[1,0,0,0,0,1],[1,0,0,0,0,1],[1,1,1,1,1,1],[0,0,1,1,0,0],[0,0,1,1,0,0]]
        },
        {
            id: 'item-1769963716505-6fv1th4',
            type: PieceType.UNION,
            position: { x: 2, y: 7 },
            shape: [[1,1,1,1],[1,1,1,1]]
        }
    ]
};
