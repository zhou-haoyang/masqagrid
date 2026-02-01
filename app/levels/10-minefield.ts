import { Level, PieceType } from '../types';

export default <Level>{
    id: '009',
    name: 'Minefield',
    width: 7,
    height: 7,
    grid: [
        "DDDDDDD",
        "DDDDDDD",
        "MMMMMMM",
        "MMMMMMM",
        "MMMMMMM",
        "IIIIIII",
        "IIIIIII"
    ],
    mainSymbols: "🐱🐬🐶🐌🐬🐶🐸🐸🐖🐸🐬🐶🐱🐖🐬🐶🐸🐖🐸🐶🐸",
    allowedSymbols: "",
    disallowedSymbols: "🐌🐬🐌🐸🦅🐖🐱🦅🐖🐱🐱🐌🦅🐌",
    initialPieces: [
        {
            id: 'item-1769894743441-ljhz8ry',
            type: PieceType.BLOCKER,
            position: { x: 1, y: 6 },
            shape: [[1]]
        },
        {
            id: 'item-1769894746587-qu576uh',
            type: PieceType.BLOCKER,
            position: { x: 3, y: 6 },
            shape: [[1]]
        },
        {
            id: 'item-1769894748661-rh4usov',
            type: PieceType.BLOCKER,
            position: { x: 5, y: 6 },
            shape: [[1]]
        },
        {
            id: 'item-1769895295062-rbncnho',
            type: PieceType.BLOCKER,
            position: { x: 0, y: 5 },
            shape: [[1]]
        },
        {
            id: 'item-1769895297941-qwt29gr',
            type: PieceType.BLOCKER,
            position: { x: 2, y: 5 },
            shape: [[1]]
        },
        {
            id: 'item-1769895299956-cvtliwu',
            type: PieceType.BLOCKER,
            position: { x: 4, y: 5 },
            shape: [[1]]
        },
        {
            id: 'item-1769895301926-91ofwrf',
            type: PieceType.BLOCKER,
            position: { x: 6, y: 5 },
            shape: [[1]]
        }
    ]
};
