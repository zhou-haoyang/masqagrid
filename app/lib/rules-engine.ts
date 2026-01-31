import { Level, Piece, SymbolGrid, Region, Position } from '../types';

/**
 * Returns symbols and their coordinates for a given region based on the current pieces.
 */
export function getVisibleSymbolsWithCoords(
    regions: Region[],
    pieces: Piece[],
    regionId: string
): { symbol: string, x: number, y: number }[] {
    const region = regions.find(r => r.id === regionId);
    if (!region || !region.symbols) return [];

    const visible: { symbol: string, x: number, y: number }[] = [];

    for (let r = 0; r < region.height; r++) {
        for (let c = 0; c < region.width; c++) {
            const globalX = region.x + c;
            const globalY = region.y + r;

            // Check if this cell is covered by ANY piece
            let covered = false;
            for (const p of pieces) {
                if (
                    globalX >= p.position.x &&
                    globalX < p.position.x + p.shape[0].length &&
                    globalY >= p.position.y &&
                    globalY < p.position.y + p.shape.length
                ) {
                    const bit = p.shape[globalY - p.position.y][globalX - p.position.x];
                    if (bit === 1) {
                        covered = true;
                        break;
                    }
                }
            }

            if (!covered) {
                const symbol = region.symbols[r][c];
                if (symbol && symbol.trim() !== '') {
                    visible.push({ symbol, x: globalX, y: globalY });
                }
            }
        }
    }

    return visible;
}

/**
 * Returns a set of visible symbols for a given region based on the current pieces.
 */
export function getVisibleSymbols(
    regions: Region[],
    pieces: Piece[],
    regionId: string
): string[] {
    return getVisibleSymbolsWithCoords(regions, pieces, regionId).map(v => v.symbol);
}

export interface WinState {
    isWin: boolean;
    violations: string[]; // Symbols that are disallowed but visible
    violatingCells: Position[]; // Coordinates of cells causing violations
}

/**
 * Returns ALL symbols (visible and covered) for a given region.
 */
export function getAllSymbolsWithCoords(
    regions: Region[],
    regionId: string
): { symbol: string, x: number, y: number }[] {
    const region = regions.find(r => r.id === regionId);
    if (!region || !region.symbols) return [];

    const all: { symbol: string, x: number, y: number }[] = [];

    for (let r = 0; r < region.height; r++) {
        for (let c = 0; c < region.width; c++) {
            const symbol = region.symbols[r][c];
            if (symbol && symbol.trim() !== '') {
                all.push({ symbol, x: region.x + c, y: region.y + r });
            }
        }
    }

    return all;
}

export function checkWinCondition(regions: Region[], pieces: Piece[]): WinState {
    // 1. Determine Rules
    const allowedSymbols = new Set(getVisibleSymbols(regions, pieces, 'allowed-region'));
    const disallowedSymbols = new Set(getVisibleSymbols(regions, pieces, 'disallowed-region'));

    // 2. Get All Potential Symbols in Main
    const allMainSymbols = getAllSymbolsWithCoords(regions, 'main-region');

    // 3. Evaluate Violations
    const violations = new Set<string>();
    const violatingCells: Position[] = [];

    for (const item of allMainSymbols) {
        // Check if this specific coordinate is covered
        let isCovered = false;
        for (const p of pieces) {
            if (
                item.x >= p.position.x &&
                item.x < p.position.x + p.shape[0].length &&
                item.y >= p.position.y &&
                item.y < p.position.y + p.shape.length
            ) {
                if (p.shape[item.y - p.position.y][item.x - p.position.x] === 1) {
                    isCovered = true;
                    break;
                }
            }
        }

        // Rule A: Disallowed symbols MUST NOT be visible
        if (!isCovered && disallowedSymbols.has(item.symbol)) {
            violations.add(item.symbol);
            violatingCells.push({ x: item.x, y: item.y });
        }

        // Rule B: Allowed symbols MUST NOT be covered
        if (isCovered && allowedSymbols.has(item.symbol)) {
            violations.add(item.symbol);
            violatingCells.push({ x: item.x, y: item.y });
        }
    }

    return {
        isWin: violatingCells.length === 0,
        violations: Array.from(violations),
        violatingCells
    };
}
