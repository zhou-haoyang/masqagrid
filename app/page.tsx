import { GameCanvas } from './components/GameCanvas';
import { LEVEL_1 } from './lib/levels';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Masqagrid</h1>
        <p className="text-gray-500">
          Combine shapes. Mask the grid. Solve the puzzle.
        </p>
      </div>

      <GameCanvas level={LEVEL_1} />

      <div className="mt-8 text-sm text-gray-400 max-w-lg text-center">
        <p>Instructions: Drag shapes from the bottom inventory onto the grid.</p>
        <p>Blue (Union) merges. Red (XOR) toggles. Overlap same-colored pieces to combine them.</p>
        <p>Cover "Disallowed" symbols to break the rules involved.</p>
      </div>
    </main>
  );
}
