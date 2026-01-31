import { Level, PieceType } from '../types';

export default <Level>{
    id: '007',
    name: 'This or That?',
    width: 8,
    height: 9,
    grid: [
        "MMMMM###",
        "MMMMM#A#",
        "MMMMM###",
        "MMMMM#D#",
        "MMMMM###",
        "IIIIIIII",
        "IIIIIIII",
        "IIIIIIII",
        "IIIIIIII"
    ],
    mainSymbols: "🐶🐶🐶🐶🐶🐶🐱🐱🐱🐶🐶🐱🐱🐱🐶🐶🐱🐱🐱🐶🐶🐶🐶🐶🐶",
    allowedSymbols: "🐱",
    disallowedSymbols: "🐶",
    initialPieces: [
        {
            id: 'item-1769886302349-8prhn95',
            type: PieceType.XOR,
            color: '#ef4444',
            position: { x: 0, y: 5 },
            shape: [[1,1,1],[1,1,1],[1,1,1]]
        },
        {
            id: 'item-1769886493216-mn7kv13',
            type: PieceType.XOR,
            color: '#ef4444',
            position: { x: 3, y: 5 },
            shape: [[1,1,1],[1,1,1],[1,1,1]]
        },
        {
            id: 'item-1769886574881-s1j0qnf',
            type: PieceType.XOR,
            color: '#ef4444',
            position: { x: 6, y: 5 },
            shape: [[1,1],[1,1]]
        },
        {
            id: 'item-1769886579839-fy4361t',
            type: PieceType.XOR,
            color: '#ef4444',
            position: { x: 6, y: 7 },
            shape: [[1,1],[1,1]]
        }
    ]
};
