import { Level, PieceType } from '../types';

export default <Level>{
    id: '005',
    name: 'Tiny',
    width: 5,
    height: 5,
    grid: [
        "IIIId",
        "I###I",
        "I#M#I",
        "I###I",
        "dIIII"
    ],
    mainSymbols: "🐶",
    allowedSymbols: "",
    disallowedSymbols: "🐶🐶",
    initialPieces: [
        {
            id: 'item-1769893725743-rho60s6',
            type: PieceType.INTERSECT,
            position: { x: 0, y: 0 },
            shape: [[1], [1]]
        },
        {
            id: 'item-1769893727831-nrj35i7',
            type: PieceType.INTERSECT,
            position: { x: 4, y: 3 },
            shape: [[1], [1]]
        }
    ]
};
