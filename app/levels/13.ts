import { Level, PieceType } from '../types';

export default <Level>{
    id: 'classic',
    name: 'Classic',
    width: 16,
    height: 12,
    coveredAllowedSymbolLimit: 0,  // default to 0, adjust as needed
    grid: [
        "................",
        ".MMMMMMMMMMMM...",
        ".MMMMMMMMMMMM...",
        ".MMMMMMMMMMMM.d.",
        ".MMMMMMMMMMMM...",
        ".MMMMMMMMMMMM...",
        "................",
        "IIIIIIIIIIIIIIII",
        "IIIIIIIIIIIIIIII",
        "IIIIIIIIIIIIIIII",
        "IIIIIIIIIIIIIIII",
        "IIIIIIIIIIIIIIII"
    ],
    mainSymbols: "💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣",
    allowedSymbols: "",
    disallowedSymbols: "💣",
    initialPieces: [
        {
            id: 'item-1769946849551-tj2de9h',
            type: PieceType.BLOCKER,
            position: { x: 0, y: 8 },
            shape: [[1, 0], [1, 0], [1, 0], [1, 1]]
        },
        {
            id: 'item-1769946943750-oxh9osf',
            type: PieceType.UNION,
            position: { x: 2, y: 10 },
            shape: [[1, 0, 1], [1, 1, 1]]
        },
        {
            id: 'item-1769946995654-209hcxl',
            type: PieceType.XOR,
            position: { x: 0, y: 7 },
            shape: [[1, 1, 1, 1, 1]]
        },
        {
            id: 'item-1769947134118-1n78ind',
            type: PieceType.INTERSECT,
            position: { x: 12, y: 8 },
            shape: [[0, 1, 0], [1, 1, 1], [0, 1, 0]]
        },
        {
            id: 'item-1769947144690-zq5qtly',
            type: PieceType.UNION,
            position: { x: 13, y: 9 },
            shape: [[0, 0, 1], [0, 1, 1], [1, 1, 0]]
        },
        {
            id: 'item-1769947174330-1a8yh10',
            type: PieceType.BLOCKER,
            position: { x: 4, y: 8 },
            shape: [[1, 1, 1], [0, 1, 0], [0, 1, 0]]
        },
        {
            id: 'item-1769947195673-b73i9ov',
            type: PieceType.XOR,
            position: { x: 5, y: 9 },
            shape: [[0, 1, 1], [0, 1, 0], [1, 1, 0]]
        },
        {
            id: 'item-1769947264630-v4bphxq',
            type: PieceType.INTERSECT,
            position: { x: 1, y: 8 },
            shape: [[0, 1, 0], [1, 1, 1], [0, 0, 1]]
        },
        {
            id: 'item-1769947300956-b7p9bf6',
            type: PieceType.INTERSECT,
            position: { x: 7, y: 10 },
            shape: [[0, 1, 1, 1], [1, 1, 0, 0]]
        },
        {
            id: 'item-1769947402214-rqdxjv1',
            type: PieceType.UNION,
            position: { x: 8, y: 7 },
            shape: [[0, 0, 1], [0, 0, 1], [1, 1, 1]]
        },
        {
            id: 'item-1769947459846-izxoqao',
            type: PieceType.BLOCKER,
            position: { x: 11, y: 9 },
            shape: [[1, 0], [1, 1], [1, 1]]
        },
        {
            id: 'item-1769947477361-uhmc6mn',
            type: PieceType.XOR,
            position: { x: 11, y: 7 },
            shape: [[1, 1, 1, 1], [0, 1, 0, 0]]
        }
    ]
};
