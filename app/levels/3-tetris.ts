import { Level, PieceType } from '../types';

export default <Level>{
    id: '002',
    name: 'Tetris',
    width: 13,
    height: 9,
    grid: [
        "#############",
        "###MMMMMMM###",
        "#a#MMMMMMM#d#",
        "###MMMMMMM###",
        "#############",
        "IIIIIIIIIIIII",
        "IIIIIIIIIIIII",
        "IIIIIIIIIIIII",
        "IIIIIIIIIIIII"
    ],
    mainSymbols: "🐶🐶🐶🐶🐶🐶🐶🐶🐶🐱🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶",
    allowedSymbols: "🐱",
    disallowedSymbols: "🐶",
    initialPieces: [
        {
            id: 'item-1769890539784-vuki51b',
            type: PieceType.BLOCKER,
            position: { x: 0, y: 6 },
            shape: [[1, 0], [1, 1], [1, 0]]
        },
        {
            id: 'item-1769890554803-xzo5cri',
            type: PieceType.BLOCKER,
            position: { x: 8, y: 7 },
            shape: [[1, 1], [1, 1]]
        },
        {
            id: 'item-1769890560818-86nhu27',
            type: PieceType.BLOCKER,
            position: { x: 5, y: 6 },
            shape: [[0, 1], [0, 1], [1, 1]]
        },
        {
            id: 'item-1769890753711-ruczuoo',
            type: PieceType.BLOCKER,
            position: { x: 3, y: 5 },
            shape: [[1], [1], [1], [1]]
        },
        {
            id: 'item-1769890777282-afibk6p',
            type: PieceType.BLOCKER,
            position: { x: 11, y: 6 },
            shape: [[1, 0], [1, 1], [0, 1]]
        }
    ]
};
