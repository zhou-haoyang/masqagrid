export enum PieceType {
    BLOCKER = 'BLOCKER',
    UNION = 'UNION',
    XOR = 'XOR',
    INTERSECT = 'INTERSECT',
}

export interface Position {
    x: number;
    y: number;
}

export interface Piece {
    id: string;
    type: PieceType;
    shape: number[][]; // 0/1 matrix
    position: Position; // Top-left coordinate on global grid
    color?: string;
}

export type SymbolGrid = string[][];

export interface Region {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    type: 'MAIN' | 'INVENTORY' | 'ALLOWED' | 'DISALLOWED';
    symbols?: SymbolGrid; // Only for regions that contain symbols (Main, Rules)
}

export interface Level {
    id: string;
    name: string;
    width: number;
    height: number;
    grid: string[]; // ASCII Grid: '.'=Empty, '#'=Blocked, 'M'=Main, 'A'=Allowed, 'D'=Disallowed, 'a'=Blocked Allowed, 'd'=Blocked Disallowed, 'I'=Inventory
    mainSymbols: string; // Symbols for M cells in reading order
    allowedSymbols: string; // Symbols for A/a cells in reading order
    disallowedSymbols: string; // Symbols for D/d cells in reading order
    coveredAllowedSymbolLimit?: number; 
    initialPieces: Piece[];
}
