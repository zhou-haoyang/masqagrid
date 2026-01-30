import { Position } from '../types';

/**
 * Creates a 2D array of the specified dimensions initialized with 0.
 */
export function createEmptyGrid(width: number, height: number): number[][] {
    return Array.from({ length: height }, () => Array(width).fill(0));
}

/**
 * Trims empty rows and columns from a binary matrix (shape).
 * Returns the trimmed matrix and the offset (top-left) relative to the original.
 */
export function trimShape(shape: number[][]): { trimmed: number[][]; offset: Position } {
    if (shape.length === 0) return { trimmed: [], offset: { x: 0, y: 0 } };

    let minRow = shape.length;
    let maxRow = -1;
    let minCol = shape[0].length;
    let maxCol = -1;

    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] !== 0) {
                if (r < minRow) minRow = r;
                if (r > maxRow) maxRow = r;
                if (c < minCol) minCol = c;
                if (c > maxCol) maxCol = c;
            }
        }
    }

    if (maxRow === -1) {
        // Empty shape
        return { trimmed: [], offset: { x: 0, y: 0 } };
    }

    const trimmed: number[][] = [];
    for (let r = minRow; r <= maxRow; r++) {
        trimmed.push(shape[r].slice(minCol, maxCol + 1));
    }

    return { trimmed, offset: { x: minCol, y: minRow } };
}

/**
 * Connected Component Labeling using Flood Fill.
 * Returns an array of isolated shapes (as 0/1 matrices) and their global positions.
 */
export function findConnectedComponents(
    globalGrid: number[][],
    bounds: { x: number; y: number; width: number; height: number }
): { shape: number[][]; position: Position }[] {
    const visited = new Set<string>();
    const components: { shape: number[][]; position: Position }[] = [];
    const rows = globalGrid.length;
    const cols = globalGrid[0].length;

    // Directions: Up, Down, Left, Right (No diagonals, per rules)
    const dirs = [
        { r: -1, c: 0 },
        { r: 1, c: 0 },
        { r: 0, c: -1 },
        { r: 0, c: 1 },
    ];

    // Restrict search to the bounds of the collision/rasterization
    // But we need to check the 'globalGrid' which is effectively the rasterized area
    // We'll treat globalGrid as the ROI. 'bounds' argument is logically the global offset of this grid?
    // Actually, let's assume 'globalGrid' IS the rasterized ROI, and 'bounds' is just its placement in the world.

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (globalGrid[r][c] !== 0 && !visited.has(`${r},${c}`)) {
                // Start Flood Fill
                const componentResult = {
                    minR: r, maxR: r,
                    minC: c, maxC: c,
                    points: [] as Position[]
                };

                const queue: Position[] = [{ x: c, y: r }];
                visited.add(`${r},${c}`);
                componentResult.points.push({ x: c, y: r });

                while (queue.length > 0) {
                    const curr = queue.shift()!;

                    for (const d of dirs) {
                        const nr = curr.y + d.r;
                        const nc = curr.x + d.c;

                        if (
                            nr >= 0 && nr < rows &&
                            nc >= 0 && nc < cols &&
                            globalGrid[nr][nc] !== 0 &&
                            !visited.has(`${nr},${nc}`)
                        ) {
                            visited.add(`${nr},${nc}`);
                            queue.push({ x: nc, y: nr });
                            componentResult.points.push({ x: nc, y: nr });

                            if (nr < componentResult.minR) componentResult.minR = nr;
                            if (nr > componentResult.maxR) componentResult.maxR = nr;
                            if (nc < componentResult.minC) componentResult.minC = nc;
                            if (nc > componentResult.maxC) componentResult.maxC = nc;
                        }
                    }
                }

                // Reconstruct Shape Matrix
                const h = componentResult.maxR - componentResult.minR + 1;
                const w = componentResult.maxC - componentResult.minC + 1;
                const newShape = createEmptyGrid(w, h);

                for (const p of componentResult.points) {
                    newShape[p.y - componentResult.minR][p.x - componentResult.minC] = 1;
                }

                components.push({
                    shape: newShape,
                    position: {
                        x: bounds.x + componentResult.minC,
                        y: bounds.y + componentResult.minR
                    }
                });
            }
        }
    }

    return components;
}
