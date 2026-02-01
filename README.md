# Masqagrid

Masqagrid is a Boolean logic puzzle game created during **Global Game Jam 2026** at the **ETH Zurich** site. Players drag shape pieces onto a grid to cover and uncover symbols, aiming to satisfy specific win conditions.

[View Game Site](https://globalgamejam.org/games/2026/masqagrid-2)

## Features

- **Boolean Logic Mechanic**: Merge pieces using UNION (OR), XOR (Exclusive OR), and INTERSECT (AND) operations.
- **Dynamic Rules**: Satisfy dynamic win conditions based on "Allowed" and "Disallowed" symbol regions.
- **Puzzle Elements**:
  - **Main Region**: The primary puzzle area.
  - **Inventory**: Starting area for pieces.
  - **Rule Regions**: Visual constraints for victory.
- **Tech Stack**: Built with Next.js 16, React 19, TypeScript, TailwindCSS, and Electron.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router) & [Electron](https://www.electronjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## Getting Started

### Prerequisites

- Node.js
- pnpm (recommended), npm, or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd masqagrid
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Running Locally

To start the development server (Web):

```bash
pnpm dev
```

To open the Electron app in development mode:

```bash
npm run dev:electron
```

### Building

To build the application for production:

```bash
# Build for web
npm run build:nextjs

# Build for Electron (Mac)
npm run build:mac

# Build for Electron (Windows)
npm run build:win

# Build for Electron (Linux)
npm run build:linux
```

## Controls

- **Drag & Drop**: Move pieces from the inventory to the grid.
- **R**: Rotate the currently dragged piece 90° clockwise.
- **F**: Flip the currently dragged piece horizontally.
- **Z**: Undo the last move.
- **C**: Reset the level.

## Level Editor

Masqagrid includes a built-in level editor for creating custom puzzles.

### Accessing the Editor

Navigate to `/editor` in your browser (e.g., `http://localhost:3000/editor`).

### Creating & Adding Levels

1.  **Design**: Use the editor tools to paint the grid, set symbol streams, and place initial pieces.
2.  **Validate**: Click "Validate" to ensure the level is solvable and rules are consistent.
3.  **Export**: Click "Export" to generate the level code.
4.  **Save**: Download the generated `.ts` file or copy the code.
5.  **Add to Game**: Place the file in the `app/levels/` directory.
    *   The game automatically loads all `.ts` files in this directory.
    *   No manual registration in `index.ts` is required.


## License

This project is licensed under the [LGPL-2.1 License](LICENSE).
