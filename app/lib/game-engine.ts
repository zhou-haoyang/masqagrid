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
    // Modified: Only return true if pieces strictly overlap.
    // Touching edges without overlap no longer triggers a connection/merge.
    return doPiecesOverlap(p1, p2);
}

function isCellOccupied(p: Piece, globalX: number, globalY: number): boolean {
    const lx = globalX - p.position.x;
    const ly = globalY - p.position.y;
    if (lx < 0 || ly < 0 || ly >= p.shape.length || lx >= p.shape[0].length) return false;
    return p.shape[ly][lx] === 1;
}

export type CollisionResult =
    | { success: true; newPieces: Piece[] }
    | { success: false; reason: 'INVALID_TYPE' | 'BLOCKER' | 'BLOCKED_CELL' };

/**
 * Handles XOR interaction with pairwise operations to avoid incorrect merging.
 * When an XOR piece is dropped, it interacts with each overlapping piece separately.
 */
function handleXORInteraction(allPieces: Piece[], droppedPiece: Piece): CollisionResult {
    // Find all pieces that overlap with the dropped XOR piece
    const overlappingPieces = allPieces.filter(p =>
        p.type !== PieceType.BLOCKER && doPiecesOverlap(p, droppedPiece)
    );

    if (overlappingPieces.length === 0) {
        // No overlaps, just add the piece
        return { success: true, newPieces: [...allPieces, droppedPiece] };
    }

    // Keep track of pieces to remove and add
    const overlappingIds = new Set(overlappingPieces.map(p => p.id));
    const piecesToKeep = allPieces.filter(p => !overlappingIds.has(p.id));
    const newPieces: Piece[] = [];

    // Process each overlapping piece pairwise with the dropped piece
    for (const existingPiece of overlappingPieces) {
        // Determine bounds for this pair
        const minX = Math.min(droppedPiece.position.x, existingPiece.position.x);
        const minY = Math.min(droppedPiece.position.y, existingPiece.position.y);
        const maxX = Math.max(
            droppedPiece.position.x + droppedPiece.shape[0].length,
            existingPiece.position.x + existingPiece.shape[0].length
        );
        const maxY = Math.max(
            droppedPiece.position.y + droppedPiece.shape.length,
            existingPiece.position.y + existingPiece.shape.length
        );

        const width = maxX - minX;
        const height = maxY - minY;

        // Apply XOR operation
        const theyMinusDroppedGrid = createEmptyGrid(width, height);
        mergeGrid(theyMinusDroppedGrid, existingPiece, minX, minY, 'SET');
        mergeGrid(theyMinusDroppedGrid, droppedPiece, minX, minY, 'ZERO');

        const droppedMinusThey = createEmptyGrid(width, height);
        mergeGrid(droppedMinusThey, droppedPiece, minX, minY, 'SET');
        mergeGrid(droppedMinusThey, existingPiece, minX, minY, 'ZERO');

        // Vectorize the result
        const components = [
            ...findConnectedComponents(theyMinusDroppedGrid, { x: minX, y: minY, width, height }), 
            ...findConnectedComponents(droppedMinusThey, { x: minX, y: minY, width, height })
        ];

        // Create new pieces with the existing piece's type (not XOR type)
        for (const comp of components) {
            newPieces.push({
                id: crypto.randomUUID(),
                type: existingPiece.type,  // Result uses existing piece's type
                position: comp.position,
                shape: comp.shape,
                color: existingPiece.color
            });
        }
    }

    return { success: true, newPieces: [...piecesToKeep, ...newPieces] };
}

/**
 * Manages the collision of a dropped piece with the existing board state.
 * now accepts optional grid for blocked cells and placement validation.
 */
export function manageCollision(allPieces: Piece[], droppedPiece: Piece, grid?: string[]): CollisionResult {
    const type = droppedPiece.type;

    // 0. Grid Placement Check
    if (grid) {
        for (let r = 0; r < droppedPiece.shape.length; r++) {
            for (let c = 0; c < droppedPiece.shape[r].length; c++) {
                if (droppedPiece.shape[r][c] === 1) {
                    const gx = droppedPiece.position.x + c;
                    const gy = droppedPiece.position.y + r;
                    // Check bounds
                    if (gy >= 0 && gy < grid.length && gx >= 0 && gx < grid[gy].length) {
                        const cellType = grid[gy][gx];
                        // Blocked cells: '#' (explicit block), 'a' (blocked allowed), 'd' (blocked disallowed)
                        if (cellType === '#' || cellType === 'a' || cellType === 'd') {
                            return { success: false, reason: 'BLOCKED_CELL' };
                        }
                        // Valid placement cells: 'M', 'A', 'D', 'I'
                        // (Pieces can be placed on Main, Allowed, Disallowed, Inventory)
                    }
                }
            }
        }
    }

    // 1. Blocker Check (Only BLOCKER pieces block overlaps)
    const blockers = allPieces.filter(p => {
        // If either piece is a BLOCKER, they block EVERYTHING they overlap with
        const hasBlocker = p.type === PieceType.BLOCKER || type === PieceType.BLOCKER;
        return hasBlocker && doPiecesOverlap(p, droppedPiece);
    });
    if (blockers.length > 0) return { success: false, reason: 'BLOCKER' };

    // 2. XOR Special Case: Pairwise interactions to avoid incorrect merging
    if (type === PieceType.XOR) {
        return handleXORInteraction(allPieces, droppedPiece);
    }

    // 3. Merge Logic for UNION/INTERSECT (All non-BLOCKER pieces can interact)
    const nonBlockerPieces = allPieces.filter(p => p.type !== PieceType.BLOCKER);

    // Find connected cluster (Transitive closure from droppedPiece)
    // Seeds: [droppedPiece]
    // Pool: all non-BLOCKER pieces (different types can now interact)
    const cluster = getConnectedCluster(droppedPiece, nonBlockerPieces);
    const clusterIds = new Set(cluster.map(p => p.id));

    // Determine result type and color: use type from existing pieces in cluster (not dropped piece)
    // If cluster has pieces, use the type of the first piece; otherwise use dropped piece type
    const resultType = cluster.length > 0 ? cluster[0].type : type;
    const resultColor = cluster.length > 0 ? cluster[0].color : droppedPiece.color;

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

    // Apply Op (use dropped piece's operation type, not result type)
    const operationType = droppedPiece.type;
    let mergedGrid: number[][];

    if (operationType === PieceType.INTERSECT) {
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
            mergedGrid = createEmptyGrid(width, height);
            for (const p of fullCluster) {
                mergeGrid(mergedGrid, p, minX, minY, 'OR');
            }
        } else {
            mergedGrid = intersectGrid;
        }
    } else {
        // UNION Logic (Accumulative)
        mergedGrid = createEmptyGrid(width, height);
        for (const p of fullCluster) {
            mergeGrid(mergedGrid, p, minX, minY, 'OR');
        }
    }

    // 4. Vectorize
    const components = findConnectedComponents(mergedGrid, { x: minX, y: minY, width, height });

    const newPieces: Piece[] = components.map((comp, index) => ({
        // Preserve original ID if it's the primary component
        id: (index === 0 && components.length === 1) ? droppedPiece.id : crypto.randomUUID(),
        type: resultType,  // Use result type (from existing pieces), not dropped piece type
        position: comp.position,
        shape: comp.shape,
        color: resultColor  // Use color from existing pieces, not dropped piece
    }));

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

function mergeGrid(target: number[][], p: Piece, offsetX: number, offsetY: number, op: 'SET' | 'OR' | 'XOR' | 'ZERO' ) {
    for (let r = 0; r < p.shape.length; r++) {
        for (let c = 0; c < p.shape[r].length; c++) {
            if (p.shape[r][c]) {
                const gx = (p.position.x + c) - offsetX;
                const gy = (p.position.y + r) - offsetY;

                if (gx >= 0 && gx < target[0].length && gy >= 0 && gy < target.length) {
                    if (op === 'SET') target[gy][gx] = 1;
                    else if (op === 'OR') target[gy][gx] |= 1;
                    else if (op === 'XOR') target[gy][gx] ^= 1;
                    else if (op === 'ZERO') target[gy][gx] = 0;
                }
            }
        }
    }
}
