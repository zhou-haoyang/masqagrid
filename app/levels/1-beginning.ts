import { Level, PieceType } from '../types';

export default <Level>{
    id: '1-beginning',
	name: 'Beginning',
    width: 6,
    height: 6,
    grid: [
        "MMMM##",
        "MMMM#A",
        "MMMM##",
        "MMMM##",
        "IIII#D",
        "IIII##"
    ],
    mainSymbols: "🐶🐱🐱🐱🐱🐱🐱🐱🐱🐱🐱🐱🐱🐱🐱🐱",
    allowedSymbols: "🐱",
    disallowedSymbols: "🐶",
    initialPieces: [
        {
            id: 'item-1769880930324-dslhiu0',
            type: PieceType.UNION,
            color: '#3b82f6',
            position: { x: 0, y: 4 },
            shape: [[1,1],[1,1]]
        }
    ]
};
