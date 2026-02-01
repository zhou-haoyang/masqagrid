import { Level, PieceType } from '../types';

export default <Level>{
    id: 'level-editor-1769942214208',
    name: 'Multicolor',
    width: 7,
    height: 7,
    coveredAllowedSymbolLimit: 0,  // default to 0, adjust as needed
    grid: [
        "#######",
        "#MM#MM#",
        "#MMdMM#",
        "#MM#MM#",
        "#######",
        "IIIIIII",
        "IIIIIII"
    ],
    mainSymbols: "🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶🐶",
    allowedSymbols: "",
    disallowedSymbols: "🐶",
    initialPieces: [
        {
            id: 'item-1769942768228-nhe3mu9',
            type: PieceType.UNION,
            position: { x: 0, y: 5 },
            shape: [[1, 1], [1, 0]]
        },
        {
            id: 'item-1769942776935-brf8el6',
            type: PieceType.INTERSECT,
            position: { x: 3, y: 5 },
            shape: [[1, 1], [1, 1]]
        },
        {
            id: 'item-1769942800481-8y9a0va',
            type: PieceType.UNION,
            position: { x: 1, y: 5 },
            shape: [[0, 1], [1, 1]]
        },
        {
            id: 'item-1769942809865-ksmvef6',
            type: PieceType.XOR,
            position: { x: 5, y: 5 },
            shape: [[1, 1], [1, 1]]
        }
    ]
};
