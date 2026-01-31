import { Level, PieceType } from '../types';

export default <Level>{
    id: '1-union-demo',
    name: 'State of Union',
    width: 7,
    height: 6,
    grid: [
        "MMM####",
        "MMM#ad#",
        "MMM####",
        "IIIIIII",
        "IIIIIII",
        "IIIIIII"
    ],
    mainSymbols: "🐶🐱🐱🐱🐱🐱🐱🐱🐶",
    allowedSymbols: "🐱",
    disallowedSymbols: "🐶",
    initialPieces: [
        {
            id: 'item-1769880930324-dslhiu0',
            type: PieceType.UNION,
            color: '#3b82f6',
            position: { x: 0, y: 3 },
            shape: [[1,1],[1,1]]
        },
        {
            id: 'item-1769884872801-mf3a9za',
            type: PieceType.UNION,
            color: '#3b82f6',
            position: { x: 4, y: 3 },
            shape: [[1,1],[1,1]]
        }
    ]
};
