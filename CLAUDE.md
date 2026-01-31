# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server on localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

No test framework is configured.

## Architecture

Masqagrid is a Next.js 16 (React 19, TypeScript) puzzle game where players drag boolean-logic shape pieces onto a grid to cover/uncover symbols and satisfy win conditions.

### Core modules in `app/lib/`:

- **game-engine.ts** — Collision detection, piece merging via boolean operations (OR/XOR/AND), connected component clustering (BFS), grid rasterization/vectorization
- **rules-engine.ts** — Win condition checking: computes visible symbols per region, checks for disallowed symbol violations
- **grid-utils.ts** — Grid creation, shape trimming, flood-fill connected components
- **levels.ts** — Level definitions (regions, pieces, symbol grids)

### Components in `app/components/`:

- **GameCanvas.tsx** — Main game container: drag-and-drop via pointer events, grid/region rendering, undo/reset, real-time win checking. State: pieces array, history stack, drag state, win state.
- **PieceRenderer.tsx** — Renders a piece's binary shape matrix as CSS grid cells

### Key types (`app/types.ts`):

- `PieceType` enum: `BLOCKER`, `UNION` (OR/blue), `XOR` (red), `INTERSECT` (AND/amber)
- `Region.type`: `MAIN`, `INVENTORY`, `ALLOWED`, `DISALLOWED`
- Pieces have a `shape: number[][]` binary matrix and grid `position`

### Game mechanics flow:

1. Player drags piece from inventory region onto main grid
2. `manageCollision()` validates placement (blockers can't overlap other types)
3. Same-type touching pieces merge via boolean op → rasterize → vectorize back into separate connected pieces
4. `checkWinCondition()` checks if any disallowed symbols remain visible in the main region

### Constants:

- Cell size is 40px, hardcoded as `CELL_SIZE` in GameCanvas
- Path alias: `@/*` maps to project root
