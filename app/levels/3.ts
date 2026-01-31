import { Level, PieceType } from '../types';

export const LEVEL_3: Level = {
    id: 'level-3',
    width: 20,
    height: 15,
    grid: [
        "MMMMMMMMMAAA........",
        "MMMMMMMMMAAA........",
        "MMMMMMMMMAAA........",
        "MMMMMMMMMAAA........",
        "MMMMMMMMMAAA........",
        "MMMMMMMMMDDD........",
        "IIIIIIIIIDDD........",
        "IIIIIIIIIDDD........",
        "IIIIIIIIIDDD........",
        "....................",
        "....................",
        "....................",
        "....................",
        "....................",
        "...................."
    ],
    mainSymbols: "✅".repeat(54),
    allowedSymbols: "               ",
    disallowedSymbols: "            ",
    initialPieces: [
        {
            id: 'piece-1769865810138-fz2mifb',
            type: PieceType.UNION,
            color: '#3b82f6',
            position: { x: 0, y: 6 },
            shape: [[1, 1], [1, 1]]
        },
        {
            id: 'piece-1769865830095-kl3f487',
            type: PieceType.UNION,
            color: '#3b82f6',
            position: { x: 2, y: 6 },
            shape: [[1, 1], [1, 1]]
        }
    ]
};
