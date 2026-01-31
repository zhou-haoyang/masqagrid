import { Piece, PieceType, Position } from '../types';
import { createEmptyGrid, findConnectedComponents } from './grid-utils';

/**
 * Checks if two pieces overlap (strict intersection).
 * Used for "Blocker" checks (different types cannot overlap).
 */
export function doPiecesOverlap(p1: Piece, p2: Piece): boolean {
    // 1. AABB Check
    const p1Right = p1.position.x + p1.shape[0].length;
    const p1Bottom = p1.position.y + p1.shape.length;
    const p2Right = p2.position.x + p2.shape[0].length;
    const p2Bottom = p2.position.y + p2.shape.length;

    if (p1.position.x >= p2Right || p2.position.x >= p1Right ||
        p1.position.y >= p2Bottom || p2.position.y >= p1Bottom) {
        return false;
    }

    // 2. Grid-cell Check
    const startX = Math.max(p1.position.x, p2.position.x);
    const endX = Math.min(p1Right, p2Right);
    const startY = Math.max(p1.position.y, p2.position.y);
    const endY = Math.min(p1Bottom, p2Bottom);

    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            const val1 = isCellOccupied(p1, x, y);
            const val2 = isCellOccupied(p2, x, y);
            if (val1 && val2) return true;
        }
    }
    return false;
}

/**
 * Checks if two pieces connect (Overlap OR Touch).
 * Used for "Merge" checks (same types merge if touching).
 */
export function doPiecesConnect(p1: Piece, p2: Piece): boolean {
    // DIVIDE pieces only "connect" (interact) if they strictly overlap.
    // Touching without overlapping does NOT trigger a merge/split for DIVIDE.
    if (p1.type === PieceType.DIVIDE && p2.type === PieceType.DIVIDE) {
        return doPiecesOverlap(p1, p2);
    }

    // 1. Expanded AABB Check (Inflate by 1)
    const p1Right = p1.position.x + p1.shape[0].length;
    const p1Bottom = p1.position.y + p1.shape.length;
    const p2Right = p2.position.x + p2.shape[0].length;
    const p2Bottom = p2.position.y + p2.shape.length;

    // If dist > 1 (gap > 0), they are disjoint. 
    // Logic: if p1.left > p2.right (strictly), gap exists.
    // touching means p1.left == p2.right.
    if (p1.position.x > p2Right || p2.position.x > p1Right ||
        p1.position.y > p2Bottom || p2.position.y > p1Bottom) {
        return false;
    }

    // 2. Pixel Check
    // Iterate P1's occupied cells. Check if any are adjacent/overlapping to P2.
    for (let r = 0; r < p1.shape.length; r++) {
        for (let c = 0; c < p1.shape[r].length; c++) {
            if (p1.shape[r][c] === 1) {
                const gx = p1.position.x + c;
                const gy = p1.position.y + r;

                // Check Self (Overlap)
                if (isCellOccupied(p2, gx, gy)) return true;
                // Check Neighbors (Touch)
                if (isCellOccupied(p2, gx + 1, gy)) return true;
                if (isCellOccupied(p2, gx - 1, gy)) return true;
                if (isCellOccupied(p2, gx, gy + 1)) return true;
                if (isCellOccupied(p2, gx, gy - 1)) return true;
            }
        }
    }
    return false;
}

function isCellOccupied(p: Piece, globalX: number, globalY: number): boolean {
    const lx = globalX - p.position.x;
    const ly = globalY - p.position.y;
    if (lx < 0 || ly < 0 || ly >= p.shape.length || lx >= p.shape[0].length) return false;
    return p.shape[ly][lx] === 1;
}

export type CollisionResult =
    | { success: true; newPieces: Piece[] }
    | { success: false; reason: 'INVALID_TYPE' | 'BLOCKER' };

/**
 * Manages the collision of a dropped piece with the existing board state.
 */
export function manageCollision(allPieces: Piece[], droppedPiece: Piece): CollisionResult {
    const type = droppedPiece.type;

    // 1. Blocker Check (Diff Type Overlap)
    const blockers = allPieces.filter(p =>
        p.type !== type && doPiecesOverlap(p, droppedPiece)
    );
    if (blockers.length > 0) return { success: false, reason: 'BLOCKER' };

    // 2. Merge Logic (Same Type Connect)
    const sameTypePieces = allPieces.filter(p => p.type === type);

    // Find connected cluster (Transitive closure from droppedPiece)
    // Seeds: [droppedPiece]
    // Pool: sameTypePieces
    const cluster = getConnectedCluster(droppedPiece, sameTypePieces);
    const clusterIds = new Set(cluster.map(p => p.id));

    // Identify pieces effectively "Removed" from board (merged into new shapes)
    const piecesToKeep = allPieces.filter(p => !clusterIds.has(p.id));

    // 3. Rasterize Cluster
    // Determine bounds
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const fullCluster = [...cluster, droppedPiece]; // droppedPiece might be new valid pos not in list yet

    for (const p of fullCluster) {
        minX = Math.min(minX, p.position.x);
        minY = Math.min(minY, p.position.y);
        maxX = Math.max(maxX, p.position.x + p.shape[0].length);
        maxY = Math.max(maxY, p.position.y + p.shape.length);
    }

    const width = maxX - minX;
    const height = maxY - minY;

    // Apply Op
    let grid: number[][]; // For UNION/XOR/INTERSECT fallback
    const newPieces: Piece[] = [];

    if (type === PieceType.DIVIDE) {
        // DIVIDE Logic:
        // 1. Build a map of Pixel -> Set<PieceID>
        const pixelMap = new Array(height).fill(0).map(() => new Array(width).fill(null).map(() => new Set<string>()));
        const idToPiece = new Map<string, Piece>();

        for (const p of fullCluster) {
            idToPiece.set(p.id, p);
            for (let r = 0; r < p.shape.length; r++) {
                for (let c = 0; c < p.shape[r].length; c++) {
                    if (p.shape[r][c]) {
                        const gx = (p.position.x + c) - minX;
                        const gy = (p.position.y + r) - minY;
                        if (gx >= 0 && gx < width && gy >= 0 && gy < height) {
                            pixelMap[gy][gx].add(p.id);
                        }
                    }
                }
            }
        }

        // 2. Group pixels by their Set<PieceID> signature
        // Signature string: "id1,id2,id3" (sorted)
        const signatureToPixels = new Map<string, { r: number, c: number }[]>();

        for (let r = 0; r < height; r++) {
            for (let c = 0; c < width; c++) {
                const ids = pixelMap[r][c];
                if (ids.size > 0) {
                    const sortedIds = Array.from(ids).sort();
                    const sig = sortedIds.join(',');
                    if (!signatureToPixels.has(sig)) {
                        signatureToPixels.set(sig, []);
                    }
                    signatureToPixels.get(sig)!.push({ r, c });
                }
            }
        }

        // 3. For each unique signature, create new pieces
        for (const [sig, pixels] of signatureToPixels.entries()) {
            // Create a grid just for this signature
            const groupGrid = createEmptyGrid(width, height);
            for (const { r, c } of pixels) {
                groupGrid[r][c] = 1;
            }

            const components = findConnectedComponents(groupGrid, { x: minX, y: minY, width, height });
            const sourceIds = sig.split(',');

            // Determine color:
            // If sourceIds has only 1 ID, use that piece's color.
            // If it has multiple (intersection), use droppedPiece.color (or mixed, but requirements say droppedPiece/intersection logic usually inherits active/dominant).
            // Let's use droppedPiece.color for intersections as per plan (simplest valid choice).
            // For single-source parts, preserve original color.
            let color = droppedPiece.color;
            if (sourceIds.length === 1) {
                const originalPiece = idToPiece.get(sourceIds[0]);
                if (originalPiece) color = originalPiece.color;
            }

            for (const comp of components) {
                newPieces.push({
                    id: crypto.randomUUID(),
                    type: type,
                    position: comp.position,
                    shape: comp.shape,
                    color: color
                });
            }
        }

    } else if (type === PieceType.INTERSECT) {
        // AND Logic with Fallback: P1 & P2 & P3...
        // If result is EMPTY (meaning pieces just touch but don't overlap, or complex disjoint),
        // Fallback to UNION (Merge).

        const intersectGrid = createEmptyGrid(width, height);
        mergeGrid(intersectGrid, fullCluster[0], minX, minY, 'SET');

        for (let i = 1; i < fullCluster.length; i++) {
            const temp = createEmptyGrid(width, height);
            mergeGrid(temp, fullCluster[i], minX, minY, 'SET');

            for (let r = 0; r < height; r++) {
                for (let c = 0; c < width; c++) intersectGrid[r][c] &= temp[r][c];
            }
        }

        // Check if Empty
        let isEmpty = true;
        outer: for (let r = 0; r < height; r++) {
            for (let c = 0; c < width; c++) {
                if (intersectGrid[r][c] === 1) {
                    isEmpty = false;
                    break outer;
                }
            }
        }

        if (isEmpty) {
            // Fallback to UNION
            grid = createEmptyGrid(width, height);
            for (const p of fullCluster) {
                mergeGrid(grid, p, minX, minY, 'OR');
            }
        } else {
            grid = intersectGrid;
        }

        // Vectorize for non-DIVIDE
        const components = findConnectedComponents(grid, { x: minX, y: minY, width, height });
        newPieces.push(...components.map(comp => ({
            id: crypto.randomUUID(),
            type: type,
            position: comp.position,
            shape: comp.shape,
            color: droppedPiece.color
        })));

    } else {
        // UNION / XOR Logic (Accumulative)
        grid = createEmptyGrid(width, height);
        for (const p of fullCluster) {
            mergeGrid(grid, p, minX, minY, type === PieceType.XOR ? 'XOR' : 'OR');
        }

        // Vectorize for non-DIVIDE
        const components = findConnectedComponents(grid, { x: minX, y: minY, width, height });
        newPieces.push(...components.map(comp => ({
            id: crypto.randomUUID(),
            type: type,
            position: comp.position,
            shape: comp.shape,
            color: droppedPiece.color
        })));
    }

    return { success: true, newPieces: [...piecesToKeep, ...newPieces] };
}

function getConnectedCluster(seed: Piece, pool: Piece[]): Piece[] {
    const cluster: Piece[] = [];
    const queue = [seed];
    const visited = new Set<string>([seed.id]); // Mark seed as visited

    // Note: 'seed' (droppedPiece) is usually NOT in 'pool' (allPieces).
    // So we don't add seed to 'cluster' output if we only want "Board Pieces consumed".
    // But the loop below finds neighbors IN POOL.

    while (queue.length > 0) {
        const current = queue.shift()!;

        for (const p of pool) {
            if (!visited.has(p.id)) {
                if (doPiecesConnect(current, p)) {
                    visited.add(p.id);
                    cluster.push(p);
                    queue.push(p);
                }
            }
        }
    }
    return cluster;
}

function mergeGrid(target: number[][], p: Piece, offsetX: number, offsetY: number, op: 'SET' | 'OR' | 'XOR') {
    for (let r = 0; r < p.shape.length; r++) {
        for (let c = 0; c < p.shape[r].length; c++) {
            if (p.shape[r][c]) {
                const gx = (p.position.x + c) - offsetX;
                const gy = (p.position.y + r) - offsetY;

                if (gx >= 0 && gx < target[0].length && gy >= 0 && gy < target.length) {
                    if (op === 'SET') target[gy][gx] = 1;
                    else if (op === 'OR') target[gy][gx] |= 1;
                    else if (op === 'XOR') target[gy][gx] ^= 1;
                }
            }
        }
    }
}
