import { Level, PieceType } from '../types';

export default <Level>{
    id: 'level-editor-1769942901830',
    name: 'Overlap',
    width: 7,
    height: 8,
    coveredAllowedSymbolLimit: 0,  // default to 0, adjust as needed
    grid: [
        "#######",
        "#M#M#D#",
        "#####M#",
        "#M#M#M#",
        "#######",
        "IIIIIII",
        "IIIIIII",
        "IIIIIII"
    ],
    mainSymbols: "🐶🐶🐶🐶🐶🐶",
    allowedSymbols: "",
    disallowedSymbols: "🐶",
    initialPieces: [
        {
            id: 'item-1769943139530-omf1kzd',
            type: PieceType.UNION,
            position: { x: 1, y: 6 },
            shape: [[1, 1]]
        },
        {
            id: 'item-1769943310865-umjor9f',
            type: PieceType.UNION,
            position: { x: 1, y: 7 },
            shape: [[1, 1]]
        },
        {
            id: 'item-1769943316814-c581vet',
            type: PieceType.XOR,
            position: { x: 4, y: 6 },
            shape: [[1, 0], [1, 1]]
        }
    ]
};
