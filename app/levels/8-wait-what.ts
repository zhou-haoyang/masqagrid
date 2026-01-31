import { Level, PieceType } from '../types';

export default <Level>{
    id: '008',
    name: 'Wait What?',
    width: 7,
    height: 7,
    grid: [
        ".......",
        "...D...",
        ".MM.MM.",
        "...D...",
        ".......",
        "IIIIIII",
        "IIIIIII"
    ],
    mainSymbols: "🐱🐱🐶🐶",
    allowedSymbols: "",
    disallowedSymbols: "🐱🐶",
    initialPieces: [
        {
            id: 'item-1769893960421-0gneur9',
            type: PieceType.BLOCKER,
            position: { x: 2, y: 5 },
            shape: [[0, 0, 1], [1, 1, 1]]
        }
    ]
};
