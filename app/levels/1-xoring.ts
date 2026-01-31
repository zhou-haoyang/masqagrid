import { Level, PieceType } from '../types';

export default <Level>{
    id: 'level-editor-1769888603583',
    name: 'XORing',
    width: 7,
    height: 8,
    grid: [
        "#######",
        "#MMM###",
        "#M#M#d#",
        "#MMM###",
        "#######",
        "IIIIIII",
        "IIIIIII",
        "IIIIIII"
    ],
    mainSymbols: "🐶🐶🐶🐶🐶🐶🐶🐶",
    allowedSymbols: "",
    disallowedSymbols: "🐶",
    initialPieces: [
        {
            id: 'item-1769888707910-qo2uq8f',
            type: PieceType.XOR,
            color: '#ef4444',
            position: { x: 3, y: 5 },
            shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
        },
        {
            id: 'item-1769888726037-4hg347f',
            type: PieceType.XOR,
            color: '#ef4444',
            position: { x: 1, y: 6 },
            shape: [[1]]
        }
    ]
};
