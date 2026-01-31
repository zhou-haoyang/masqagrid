# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## The Golden Rule

If there is ambiguity when understanding user's requests, or there are many ways to implement the same feature,
always ask the user before making any decision.


## Commands

```bash
pnpm dev      # Start dev server on localhost:3000
npm build    # Production build
```

No test framework is configured.

## Architecture

Masqagrid is a Next.js 16 (React 19, TypeScript) puzzle game where players drag boolean-logic shape pieces onto a grid to cover/uncover symbols and satisfy win conditions.

### Core modules in `app/lib/`:

- **game-engine.ts** — Collision detection, piece merging via boolean operations (OR/XOR/AND), connected component clustering (BFS), grid rasterization/vectorization
- **rules-engine.ts** — Win condition checking: computes visible symbols per region, checks for disallowed symbol violations
- **grid-utils.ts** — Grid creation, shape trimming, flood-fill connected components
- **level-parser.ts** — Parse level ASCII grid into runtime structures (regions, symbol grids)
- **piece-utils.ts** — Piece color definitions by type

### Components in `app/components/`:

- **GameCanvas.tsx** — Main game container: drag-and-drop via pointer events, grid/region rendering, undo/reset, real-time win checking. State: pieces array, history stack, drag state, win state.
- **PieceRenderer.tsx** — Renders a piece's binary shape matrix as CSS grid cells
- **LevelSelector.tsx** — Level selection UI

### Key types (`app/types.ts`):

- `PieceType` enum: `BLOCKER`, `UNION` (OR/blue), `XOR` (red), `INTERSECT` (AND/amber)
- `Region.type`: `MAIN`, `INVENTORY`, `ALLOWED`, `DISALLOWED`
- Pieces have a `shape: number[][]` binary matrix and grid `position`

### Constants:

- Cell size is 40px, hardcoded as `CELL_SIZE` in GameCanvas
- Path alias: `@/*` maps to project root

## Game Mechanics

### Piece Types (Boolean Operations)

Each piece has a type that determines how it interacts with other pieces:

- **BLOCKER** (Gray) — Solid blocker that cannot overlap with any other piece type
- **UNION** (Blue #3b82f6) — OR operation: combines all occupied cells when pieces merge
- **XOR** (Red #ef4444) — Exclusive OR operation: toggles cells (symmetric difference) when pieces merge
- **INTERSECT** (Amber #fbbf24) — AND operation: keeps only overlapping cells when pieces merge (fallback to UNION if result would be empty)

### Cell Types & Regions

Each grid cell is defined by a single character in the level's ASCII grid:

- `.` = Empty/no region
- `#` = Blocked cell (pieces cannot be placed here)
- `M` = Main region cell (the primary puzzle area with symbols)
- `A` = Allowed region cell (unblocked, shows which symbols are allowed)
- `a` = Allowed region cell (blocked)
- `D` = Disallowed region cell (unblocked, shows which symbols are forbidden)
- `d` = Disallowed region cell (blocked)
- `I` = Inventory region cell (where pieces start)

### Regions

- **MAIN** — Primary puzzle area containing symbols to cover/uncover
- **ALLOWED** — Rule region showing what symbols are allowed to be visible in MAIN
- **DISALLOWED** — Rule region showing what symbols must NOT be visible in MAIN
- **INVENTORY** — Starting area for draggable pieces

### Symbol Visibility

- Symbols in a region are **visible** if the cell is NOT covered by any piece
- When a piece's shape occupies a cell (`shape[y][x] == 1`), that cell's symbol becomes invisible
- Dynamic rules: visible symbols in ALLOWED/DISALLOWED regions determine current win conditions

### Win Conditions

The player wins when:
1. No visible symbols in the MAIN region match any visible symbols in the DISALLOWED region

The player violates the rules when:
1. Any visible symbol in MAIN appears in the visible DISALLOWED symbols

**Example**: If DISALLOWED shows 🐶, the player must cover all 🐶 symbols in MAIN with pieces.

### Game Flow

1. Player drags piece from inventory region onto main grid
2. During drag, player can:
   - Press **R** to rotate piece 90° clockwise
   - Press **F** to flip piece horizontally
3. On release, `manageCollision()` validates placement:
   - Pieces cannot be placed on blocked cells (`#`, `a`, `d`)
   - BLOCKER pieces cannot overlap with different piece types
   - Different logical operation types cannot overlap
4. If same-type pieces touch or overlap, they merge:
   - Find all connected same-type pieces (BFS cluster)
   - Rasterize cluster into single grid
   - Apply boolean operation (OR/XOR/AND)
   - Vectorize result back into separate connected components
5. `checkWinCondition()` runs to check if any disallowed symbols remain visible
6. Player can undo (**Z**) or reset level (**C**)

### Keyboard Controls

- **R** — Rotate piece 90° clockwise (during drag)
- **F** — Flip piece horizontally (during drag)
- **Z** — Undo last move
- **C** — Reset level to initial state

### Piece Structure

Each piece is defined by:
```typescript
{
  id: string            // Unique identifier
  type: PieceType       // BLOCKER | UNION | XOR | INTERSECT
  shape: number[][]     // Binary matrix (0 = empty, 1 = occupied)
  position: {x, y}      // Grid coordinates (top-left corner)
  color?: string        // Optional override color
}
```

### Collision & Merging Algorithm

1. **Placement Check**: Verify all cells where piece would be placed are valid (not blocked)
2. **Blocker Check**: If piece is BLOCKER or overlaps with different type, reject
3. **Clustering**: Find all same-type pieces connected to placed piece (4-way connectivity: up/down/left/right)
4. **Rasterization**: Convert all clustered pieces into single binary grid
5. **Boolean Operation**: Apply type-specific operation (OR/XOR/AND)
6. **Vectorization**: Use flood-fill to find separate connected components
7. **Update State**: Replace old pieces with new vectorized pieces
