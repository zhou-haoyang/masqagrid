import { useState } from 'react';
import { Region } from '@/app/types';

interface SymbolGridEditorProps {
  region: Region;
  onUpdate: (symbols: string[][]) => void;
}

export function SymbolGridEditor({ region, onUpdate }: SymbolGridEditorProps) {
  const [draggedSymbol, setDraggedSymbol] = useState<{
    row: number;
    col: number;
    value: string;
  } | null>(null);

  if (!region.symbols) {
    return (
      <div className="text-sm text-gray-500">
        This region type does not support symbols.
      </div>
    );
  }

  const handleSymbolChange = (row: number, col: number, value: string) => {
    const newSymbols = region.symbols!.map((r, rIdx) =>
      r.map((c, cIdx) => (rIdx === row && cIdx === col ? value.slice(0, 2) : c))
    );
    onUpdate(newSymbols);
  };

  const handleClearAll = () => {
    const newSymbols = Array.from({ length: region.height }, () =>
      Array(region.width).fill('')
    );
    onUpdate(newSymbols);
  };

  // Drag-and-drop for MAIN region only
  const handleDragStart = (row: number, col: number, value: string) => {
    if (region.type !== 'MAIN') return;
    setDraggedSymbol({ row, col, value });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (row: number, col: number) => {
    if (!draggedSymbol || region.type !== 'MAIN') return;

    const newSymbols = region.symbols!.map((r) => [...r]);

    // Swap or move symbol
    const targetValue = newSymbols[row][col];
    newSymbols[row][col] = draggedSymbol.value;
    newSymbols[draggedSymbol.row][draggedSymbol.col] = targetValue;

    onUpdate(newSymbols);
    setDraggedSymbol(null);
  };

  const isDraggable = region.type === 'MAIN';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-medium text-gray-700">Symbol Grid</h4>
        <button
          onClick={handleClearAll}
          className="text-xs text-red-600 hover:text-red-700 hover:underline"
        >
          Clear All
        </button>
      </div>

      <div
        className="grid gap-1 p-2 bg-gray-50 rounded border border-gray-200"
        style={{
          gridTemplateColumns: `repeat(${region.width}, minmax(0, 1fr))`,
        }}
      >
        {region.symbols.map((row, r) =>
          row.map((symbol, c) => (
            <div
              key={`${r}-${c}`}
              className="relative"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(r, c)}
            >
              <input
                type="text"
                value={symbol}
                onChange={(e) => handleSymbolChange(r, c, e.target.value)}
                draggable={isDraggable && symbol !== ''}
                onDragStart={() => handleDragStart(r, c, symbol)}
                className={`w-full h-10 text-center border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-emoji ${isDraggable && symbol !== '' ? 'cursor-move' : ''
                  }`}
                placeholder="·"
                maxLength={2}
                title={
                  isDraggable && symbol !== ''
                    ? 'Drag to move symbol (MAIN region only)'
                    : 'Enter symbol (letter or emoji)'
                }
              />
            </div>
          ))
        )}
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p>Enter symbols (letters, emojis, max 2 characters)</p>
        {isDraggable && (
          <p className="text-blue-600">Drag symbols to reposition (MAIN region only)</p>
        )}
      </div>
    </div>
  );
}
