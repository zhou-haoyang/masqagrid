import { Level, Piece, SymbolGrid } from '../types';

/**
 * Returns a set of visible symbols for a given region based on the current pieces.
 */
export function getVisibleSymbols(
    level: Level,
    pieces: Piece[],
    regionId: string
): string[] {
    const region = level.regions.find(r => r.id === regionId);
    if (!region || !region.symbols) return [];

    const visible: string[] = [];

    for (let r = 0; r < region.height; r++) {
        for (let c = 0; c < region.width; c++) {
            const globalX = region.x + c;
            const globalY = region.y + r;

            // Check if this cell is covered by ANY piece
            let covered = false;
            for (const p of pieces) {
                // Simple bounding box check first
                if (
                    globalX >= p.position.x &&
                    globalX < p.position.x + p.shape[0].length &&
                    globalY >= p.position.y &&
                    globalY < p.position.y + p.shape.length
                ) {
                    // Check actual shape
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
                    visible.push(symbol);
                }
            }
        }
    }

    return visible;
}

export interface WinState {
    isWin: boolean;
    violations: string[]; // Symbols that are disallowed but visible
}

export function checkWinCondition(level: Level, pieces: Piece[]): WinState {
    // 1. Determine Rules
    // Rules are dynamic: They depend on what is visible in the Rule Regions
    const allowedSymbols = new Set(getVisibleSymbols(level, pieces, 'allowed-symbols'));
    const disallowedSymbols = new Set(getVisibleSymbols(level, pieces, 'disallowed-symbols'));

    // 2. Determine State
    const mainSymbols = getVisibleSymbols(level, pieces, 'main-grid');

    // 3. Evaluate
    const violations: string[] = [];

    for (const s of mainSymbols) {
        if (disallowedSymbols.has(s)) {
            violations.push(s);
        }
        // Optional: Strict "Allowed" check? 
    // "only certain symbols in the grid is exposed" -> implies if it's not in Allowed, it's bad?
    // User Feedback: "Covering disallowed symbols doesn't seem to work". 
    // This implies that if we remove a rule, the symbol should be valid.
    // If we enforce Strict Whitelist, removing 'C' from Disallowed doesn't make it Allowed (it's not in A/B).
    // So we disable Whitelist check for now to make the mechanics demonstrable.
    /*
    if (allowedSymbols.size > 0 && !allowedSymbols.has(s)) {
       violations.push(s); 
    }
    */    }

    return {
        isWin: violations.length === 0,
        violations: Array.from(new Set(violations)) // Dedup
    };
}
