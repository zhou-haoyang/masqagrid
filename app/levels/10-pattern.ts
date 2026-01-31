import { Level, PieceType } from '../types';

export default <Level>{
    id: '010',
    name: 'Break the Pattern',
    width: 7,
    height: 6,
    grid: [
        "MMMM###",
        "MMMM#A#",
        "MMMM###",
        "MMMM###",
        "IIII#D#",
        "IIII###"
    ],
    mainSymbols: "🐶🐱🐱🐶🐱🐱🐱🐱🐱🐱🐱🐱🐶🐱🐱🐶",
    allowedSymbols: "🐱",
    disallowedSymbols: "🐶",
    initialPieces: [
        {
            id: 'item-1769882799930-qhegwvv',
            type: PieceType.INTERSECT,
            color: '#fbbf24',
            position: { x: 0, y: 4 },
            shape: [[1,1],[1,1]]
        },
        {
            id: 'item-1769882821394-pc0e4c2',
            type: PieceType.INTERSECT,
            color: '#fbbf24',
            position: { x: 2, y: 7 },
            shape: [[1,1],[0,0]]
        },
        {
            id: 'item-1769882865875-g9pnirt',
            type: PieceType.INTERSECT,
            color: '#fbbf24',
            position: { x: 2, y: 4 },
            shape: [[1,1],[0,0]]
        }
    ]
};
