import { Level, PieceType } from '../types';

export default <Level>{
    id: '004',
    name: 'State of Union',
    width: 9,
    height: 5,
    grid: [
        "###MMM###",
        "#A#MMM#D#",
        "###MMM###",
        "IIIIIIIII",
        "IIIIIIIII",
    ],
    mainSymbols: "🐶🐱🐱🐱🐱🐱🐱🐱🐶",
    allowedSymbols: "🐱",
    disallowedSymbols: "🐶",
    initialPieces: [
        {
            id: 'item-1769880930324-dslhiu0',
            type: PieceType.UNION,
            position: { x: 2, y: 3 },
            shape: [[1, 1], [1, 1]]
        },
        {
            id: 'item-1769884872801-mf3a9za',
            type: PieceType.UNION,
            position: { x: 5, y: 3 },
            shape: [[1, 1], [1, 1]]
        }
    ]
};
