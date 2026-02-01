import { Level, PieceType } from '../types';

export default <Level>{
    id: '99',
    name: 'The End',
    width: 27,
    height: 13,
    coveredAllowedSymbolLimit: 0,  // default to 0, adjust as needed
    grid: [
        "###########################",
        "#MMMMMMMMMMMMMMMMMMMMMMM#a#",
        "#MMMMMMMMMMMMMMMMMMMMMMM#a#",
        "#MMMMMMMMMMMMMMMMMMMMMMM#a#",
        "#MMMMMMMMMMMMMMMMMMMMMMM#a#",
        "#MMMMMMMMMMMMMMMMMMMMMMM#a#",
        "#MMMMMMMMMMMMMMMMMMMMMMM###",
        "#MMMMMMMMMMMMMMMMMMMMMMM#d#",
        "###########################",
        "IIIIIIIIIIIIIIIIIIIIIIIIIII",
        "IIIIIIIIIIIIIIIIIIIIIIIIIII",
        "IIIIIIIIIIIIIIIIIIIIIIIIIII",
        "IIIIIIIIIIIIIIIIIIIIIIIIIII"
    ],
    mainSymbols: "🐺🐺🐺🐺🐺🐑🐺🐑🐑🐑🐺🐑🐺🐑🐑🐑🐺🐑🐺🐺🐑🐺🐺🐑🐑🐺🐑🐑🐑🐺🐑🐑🐑🐺🐑🐺🐑🐑🐑🐺🐑🐺🐺🐺🐺🐺🐑🐑🐺🐑🐑🐑🐺🐺🐑🐺🐺🐑🐺🐑🐑🐑🐺🐑🐺🐑🐺🐑🐺🐑🐑🐺🐑🐑🐑🐑🐺🐺🐺🐑🐑🐺🐺🐑🐺🐺🐑🐺🐑🐺🐑🐺🐑🐑🐺🐑🐑🐑🐑🐑🐺🐑🐑🐑🐑🐺🐑🐺🐑🐑🐺🐑🐑🐑🐺🐑🐑🐺🐑🐑🐑🐑🐑🐺🐑🐑🐑🐑🐺🐺🐺🐑🐑🐺🐑🐑🐑🐺🐑🐑🐺🐑🐑🐑🐑🐑🐺🐑🐑🐑🐑🐑🐺🐑🐑🐑🐺🐑🐑🐑🐺",
    allowedSymbols: "🐑🐑🐑🐑🐑",
    disallowedSymbols: "🐺",
    initialPieces: [
        {
            id: 'item-1769959485664-favlyvh',
            type: PieceType.UNION,
            position: { x: 0, y: 9 },
            shape: [[1, 1, 1, 1, 1]]
        },
        {
            id: 'item-1769959841699-matzrgu',
            type: PieceType.XOR,
            position: { x: 0, y: 10 },
            shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
        },
        {
            id: 'item-1769959873348-uu6fxea',
            type: PieceType.XOR,
            position: { x: 3, y: 10 },
            shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
        },
        {
            id: 'item-1769959875680-eu0cuca',
            type: PieceType.XOR,
            position: { x: 6, y: 10 },
            shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
        },
        {
            id: 'item-1769959877679-wqamybf',
            type: PieceType.XOR,
            position: { x: 9, y: 10 },
            shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
        },
        {
            id: 'item-1769959879647-yd3t4uj',
            type: PieceType.XOR,
            position: { x: 12, y: 10 },
            shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
        },
        {
            id: 'item-1769959898058-tnln4p3',
            type: PieceType.INTERSECT,
            position: { x: 5, y: 9 },
            shape: [[1, 1, 1]]
        },
        {
            id: 'item-1769959936811-mxi6mjh',
            type: PieceType.INTERSECT,
            position: { x: 8, y: 9 },
            shape: [[1, 1, 1]]
        },
        {
            id: 'item-1769959939217-mx71tkt',
            type: PieceType.INTERSECT,
            position: { x: 11, y: 9 },
            shape: [[1, 1, 1]]
        },
        {
            id: 'item-1769959943169-oxneldi',
            type: PieceType.INTERSECT,
            position: { x: 14, y: 9 },
            shape: [[1, 1, 1]]
        },
        {
            id: 'item-1769959945171-547swf7',
            type: PieceType.INTERSECT,
            position: { x: 17, y: 9 },
            shape: [[1, 1, 1]]
        },
        {
            id: 'item-1769959968662-1qq28b5',
            type: PieceType.UNION,
            position: { x: 18, y: 10 },
            shape: [[1, 1], [1, 0]]
        },
        {
            id: 'item-1769959973736-0y8owem',
            type: PieceType.UNION,
            position: { x: 15, y: 10 },
            shape: [[1, 1], [1, 0]]
        },
        {
            id: 'item-1769959980058-i1c6efy',
            type: PieceType.XOR,
            position: { x: 19, y: 10 },
            shape: [[0, 1], [1, 1]]
        },
        {
            id: 'item-1769959985894-jtq0r4s',
            type: PieceType.XOR,
            position: { x: 16, y: 10 },
            shape: [[0, 1], [1, 1]]
        },
        {
            id: 'item-1769960024378-pspivyl',
            type: PieceType.UNION,
            position: { x: 15, y: 12 },
            shape: [[1, 1, 1, 1]]
        },
        {
            id: 'item-1769960032669-knkifev',
            type: PieceType.UNION,
            position: { x: 19, y: 12 },
            shape: [[1, 1, 1, 1]]
        },
        {
            id: 'item-1769960067033-ivoqihc',
            type: PieceType.BLOCKER,
            position: { x: 21, y: 10 },
            shape: [[1, 1]]
        },
        {
            id: 'item-1769960069047-qxc7wtb',
            type: PieceType.BLOCKER,
            position: { x: 21, y: 11 },
            shape: [[1, 1]]
        },
        {
            id: 'item-1769960172916-8qjw9fo',
            type: PieceType.UNION,
            position: { x: 20, y: 9 },
            shape: [[1, 1, 1, 1]]
        },
        {
            id: 'item-1769960199977-hus25pm',
            type: PieceType.BLOCKER,
            position: { x: 23, y: 10 },
            shape: [[1], [1]]
        }
    ]
};
