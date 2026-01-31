import { Level, PieceType } from '../types';

export default <Level>{
    id: '1-beginning',
	name: 'Beginning',
    width: 7,
    height: 6,
    grid: [
        "MMMM###",
        "MMMM#a#",
        "MMMM#d#",
        "MMMM###",
        "IIIIIII",
        "IIIIIII"
    ],
    mainSymbols: "🐶🐱🐱🐱🐱🐶🐱🐱🐱🐱🐱🐱🐱🐱🐱🐱",
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
