import { Level, Region } from '../types';

export interface ParsedLevel {
    regions: Region[];
    symbolMap: Map<string, string>; // "x,y" -> symbol
    gridCells: string[][]; // 2D array of grid chars
}

/**
 * Parses a Level's grid and symbolStream into runtime structures.
 */
export function parseLevel(level: Level): ParsedLevel {
    const { grid, mainSymbols, allowedSymbols, disallowedSymbols, width, height } = level;
    
    // Convert grid strings to 2D array
    const gridCells: string[][] = grid.map(row => row.split(''));
    
    // Build symbol map and extract regions
    const symbolMap = new Map<string, string>();
    const regionMap = new Map<string, { cells: Array<{x: number, y: number}>, type: Region['type'] }>();
    
    const mainSymbolsArr = [...mainSymbols.replace(/[\n\r]/g, '')];
    const allowedSymbolsArr = [...allowedSymbols.replace(/[\n\r]/g, '')];
    const disallowedSymbolsArr = [...disallowedSymbols.replace(/[\n\r]/g, '')];
    
    let mainIndex = 0;
    let allowedIndex = 0;
    let disallowedIndex = 0;
    
    // Scan grid and assign symbols
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cell = gridCells[y]?.[x] || '.';
            
            // Cells that need symbols: M, A, D, a, d
            if (cell === 'M') {
                const symbol = mainSymbolsArr[mainIndex] || '';
                symbolMap.set(`${x},${y}`, symbol);
                mainIndex++;
                
                if (!regionMap.has('MAIN')) {
                    regionMap.set('MAIN', { cells: [], type: 'MAIN' });
                }
                regionMap.get('MAIN')!.cells.push({ x, y });
            } else if (cell === 'A' || cell === 'a') {
                const symbol = allowedSymbolsArr[allowedIndex] || '';
                symbolMap.set(`${x},${y}`, symbol);
                allowedIndex++;
                
                if (!regionMap.has('ALLOWED')) {
                    regionMap.set('ALLOWED', { cells: [], type: 'ALLOWED' });
                }
                regionMap.get('ALLOWED')!.cells.push({ x, y });
            } else if (cell === 'D' || cell === 'd') {
                const symbol = disallowedSymbolsArr[disallowedIndex] || '';
                symbolMap.set(`${x},${y}`, symbol);
                disallowedIndex++;
                
                if (!regionMap.has('DISALLOWED')) {
                    regionMap.set('DISALLOWED', { cells: [], type: 'DISALLOWED' });
                }
                regionMap.get('DISALLOWED')!.cells.push({ x, y });
            } else if (cell === 'I') {
                // Track inventory region
                if (!regionMap.has('INVENTORY')) {
                    regionMap.set('INVENTORY', { cells: [], type: 'INVENTORY' });
                }
                regionMap.get('INVENTORY')!.cells.push({ x, y });
            }
        }
    }
    
    // Convert region map to Region array
    const regions: Region[] = [];
    regionMap.forEach((data, key) => {
        if (data.cells.length === 0) return;
        
        // Calculate bounding box
        const xs = data.cells.map(c => c.x);
        const ys = data.cells.map(c => c.y);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);
        
        const regionWidth = maxX - minX + 1;
        const regionHeight = maxY - minY + 1;
        
        // Build symbols grid for this region (if applicable)
        let symbols: string[][] | undefined;
        if (data.type === 'MAIN' || data.type === 'ALLOWED' || data.type === 'DISALLOWED') {
            symbols = Array.from({ length: regionHeight }, () => Array(regionWidth).fill(''));
            data.cells.forEach(({ x, y }) => {
                const localX = x - minX;
                const localY = y - minY;
                symbols![localY][localX] = symbolMap.get(`${x},${y}`) || '';
            });
        }
        
        regions.push({
            id: `${data.type.toLowerCase()}-region`,
            type: data.type,
            x: minX,
            y: minY,
            width: regionWidth,
            height: regionHeight,
            symbols
        });
    });
    
    return { regions, symbolMap, gridCells };
}
