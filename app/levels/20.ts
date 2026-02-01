import { Level, PieceType } from '../types';

export default <Level>{
    id: '20',
    name: 'Going Wild',
    width: 15,
    height: 13,
    coveredAllowedSymbolLimit: 0,  // default to 0, adjust as needed
    grid: [
        ".......MMMMMMMM",
        ".Aa.Dd.MMMMMMMM",
        ".aA.dD.MMMMMMMM",
        ".......MMMMMMMM",
        "IIIIIIIMMMMMMMM",
        "IIIIIIIMMMMMMMM",
        "IIIIIIIMMMMMMMM",
        "IIIIIIIMMMMMMMM",
        "IIIIIIIMMMMMMMM",
        "IIIIIIIMMMMMMMM",
        "IIIIIIIMMMMMMMM",
        "IIIIIIIMMMMMMMM",
        "IIIIIIIMMMMMMMM"
    ],
    mainSymbols: "🐮🐍🐍🐮🐴🐍🐱🐴🐱🐱🐍🐯🐴🐯🐯🐯🦊🐯🐺🐮🐴🐺🐺🐰🐺🐍🐴🐰🦊🐮🦊🐮🐺🐴🐮🐯🐰🦊🐴🐍🐺🐰🦊🐯🐰🐱🐯🐺🐴🐍🐰🐯🐮🐯🐴🦊🐺🐮🐱🐯🐍🐺🐺🐰🐍🐰🐯🐴🐍🐍🐍🐰🐯🐴🐯🐺🐍🐯🐺🐯🐍🐍🐱🐴🐍🐴🐱🐮🐴🐴🐱🐰🐍🐴🐺🐍🐰🐰🐱🐍🐺🦊🦊🐯",
    allowedSymbols: "🐮🐴🐱🐰",
    disallowedSymbols: "🐺🐯🐍🦊",
    initialPieces: [
        {
            id: 'item-1769952651556-x44idsr',
            type: PieceType.XOR,
            position: { x: 4, y: 10 },
            shape: [[1, 1], [1, 0], [1, 1]]
        },
        {
            id: 'item-1769952687451-xtqcave',
            type: PieceType.XOR,
            position: { x: 0, y: 10 },
            shape: [[1, 1], [1, 0], [1, 0]]
        },
        {
            id: 'item-1769952704730-szsds7b',
            type: PieceType.XOR,
            position: { x: 1, y: 10 },
            shape: [[0, 1], [1, 1], [1, 0]]
        },
        {
            id: 'item-1769952715433-ezekruz',
            type: PieceType.XOR,
            position: { x: 2, y: 10 },
            shape: [[0, 1], [0, 1], [1, 1]]
        },
        {
            id: 'item-1769952734551-cuhi85c',
            type: PieceType.XOR,
            position: { x: 5, y: 10 },
            shape: [[0, 1], [1, 1], [0, 1]]
        },
        {
            id: 'item-1769952749062-fdo73z4',
            type: PieceType.INTERSECT,
            position: { x: 0, y: 7 },
            shape: [[1, 1], [1, 0], [1, 0]]
        },
        {
            id: 'item-1769952751913-yggrohi',
            type: PieceType.INTERSECT,
            position: { x: 1, y: 7 },
            shape: [[0, 1], [1, 1], [1, 0]]
        },
        {
            id: 'item-1769952760038-lzg538o',
            type: PieceType.INTERSECT,
            position: { x: 2, y: 7 },
            shape: [[0, 1], [0, 1], [1, 1]]
        },
        {
            id: 'item-1769952765018-v9d506u',
            type: PieceType.INTERSECT,
            position: { x: 4, y: 7 },
            shape: [[1, 1], [1, 0], [1, 1]]
        },
        {
            id: 'item-1769952768143-7tsna4r',
            type: PieceType.INTERSECT,
            position: { x: 5, y: 7 },
            shape: [[0, 1], [1, 1], [0, 1]]
        },
        {
            id: 'item-1769952783958-7jptmg5',
            type: PieceType.UNION,
            position: { x: 0, y: 4 },
            shape: [[1, 1], [1, 0], [1, 0]]
        },
        {
            id: 'item-1769952788909-kf6p2uh',
            type: PieceType.UNION,
            position: { x: 1, y: 4 },
            shape: [[0, 1], [1, 1], [1, 0]]
        },
        {
            id: 'item-1769952792834-l2i2h3s',
            type: PieceType.UNION,
            position: { x: 2, y: 4 },
            shape: [[0, 1], [0, 1], [1, 1]]
        },
        {
            id: 'item-1769952795427-2pqgmos',
            type: PieceType.UNION,
            position: { x: 4, y: 4 },
            shape: [[1, 1], [1, 0], [1, 1]]
        },
        {
            id: 'item-1769952797993-6ku8cqi',
            type: PieceType.UNION,
            position: { x: 5, y: 4 },
            shape: [[0, 1], [1, 1], [0, 1]]
        }
    ]
};
