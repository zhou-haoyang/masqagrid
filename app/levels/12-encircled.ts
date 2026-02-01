import { Level, PieceType } from '../types';

export default <Level>{
    id: '12-encircled',
    name: 'Encircled',
    width: 11,
    height: 20,
    coveredAllowedSymbolLimit: 64,  // default to 0, adjust as needed
    grid: [
        "AA##MMM##DD",
        "A#MMMMMMM#D",
        "#MMMMMMMMM#",
        "#MMMMMMMMM#",
        "MMMMMMMMMMM",
        "MMMMMMMMMMM",
        "MMMMMMMMMMM",
        "#MMMMMMMMM#",
        "#MMMMMMMMM#",
        "D#MMMMMMM#D",
        "DD##MMM##DD",
        "###########",
        "...........",
        "...........",
        "...........",
        "...........",
        "...........",
        "...........",
        "...........",
        "..........."
    ],
    mainSymbols: "🐺🐺🐺🐺🐑🐴🐑🐑🐴🐺🐺🐴🐑🐑🐺🐑🐑🐴🐺🐑🐴🐑🐑🐴🐑🐑🐴🐑🐺🐑🐑🐴🐑🐑🐴🐑🐑🐴🐺🐑🐴🐺🐑🐴🐴🐑🐴🐺🐑🐴🐺🐑🐴🐑🐑🐴🐑🐑🐴🐑🐺🐴🐑🐑🐴🐑🐴🐑🐑🐴🐺🐑🐑🐑🐺🐑🐑🐴🐺🐺🐴🐑🐑🐴🐑🐺🐺🐺🐺",
    allowedSymbols: "🐑🐴🐴",
    disallowedSymbols: "🐺🐺🐺🐺🐺🐺🐺🐺🐺",
    initialPieces: [
        {
            id: 'item-1769947116325-bdjrm5z',
            type: PieceType.UNION,
            position: { x: 0, y: 12 },
            shape: [[1,1,1],[1,1,1],[1,1,1],[1,1,1]]
        },
        {
            id: 'item-1769947144711-st0zs4y',
            type: PieceType.XOR,
            position: { x: 5, y: 12 },
            shape: [[1],[1],[1],[1]]
        },
        {
            id: 'item-1769947156459-54engl3',
            type: PieceType.UNION,
            position: { x: 8, y: 12 },
            shape: [[1,1,1],[1,1,1],[1,1,1],[1,1,1]]
        },
        {
            id: 'item-1769947170596-mgoqgmv',
            type: PieceType.UNION,
            position: { x: 8, y: 16 },
            shape: [[1,1,1],[1,1,1],[1,1,1],[1,1,1]]
        },
        {
            id: 'item-1769947173982-94ohhi9',
            type: PieceType.UNION,
            position: { x: 0, y: 16 },
            shape: [[1,1,1],[1,1,1],[1,1,1],[1,1,1]]
        },
        {
            id: 'item-1769948075479-onpy71p',
            type: PieceType.XOR,
            position: { x: 5, y: 16 },
            shape: [[1],[1],[1],[1]]
        },
        {
            id: 'item-1769948411836-rfbbctw',
            type: PieceType.INTERSECT,
            position: { x: 3, y: 12 },
            shape: [[1,1],[1,1],[0,0],[0,0]]
        },
        {
            id: 'item-1769948418089-ykxdzgr',
            type: PieceType.INTERSECT,
            position: { x: 3, y: 14 },
            shape: [[1,1],[1,1],[0,0],[0,0]]
        },
        {
            id: 'item-1769948450338-mujp883',
            type: PieceType.INTERSECT,
            position: { x: 3, y: 16 },
            shape: [[1,1],[1,1],[0,0],[0,0]]
        },
        {
            id: 'item-1769948452792-u62xrui',
            type: PieceType.INTERSECT,
            position: { x: 3, y: 18 },
            shape: [[1,1],[1,1],[0,0],[0,0]]
        },
        {
            id: 'item-1769948455341-r62qs63',
            type: PieceType.INTERSECT,
            position: { x: 6, y: 18 },
            shape: [[1,1],[1,1],[0,0],[0,0]]
        },
        {
            id: 'item-1769948457479-bnihbzs',
            type: PieceType.INTERSECT,
            position: { x: 6, y: 16 },
            shape: [[1,1],[1,1],[0,0],[0,0]]
        },
        {
            id: 'item-1769948460179-47xissa',
            type: PieceType.INTERSECT,
            position: { x: 6, y: 14 },
            shape: [[1,1],[1,1],[0,0],[0,0]]
        },
        {
            id: 'item-1769948462461-1lcye7i',
            type: PieceType.INTERSECT,
            position: { x: 6, y: 12 },
            shape: [[1,1],[1,1],[0,0],[0,0]]
        }
    ]
};
