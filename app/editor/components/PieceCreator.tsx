import { useState } from 'react';
import { PieceType, Piece } from '@/app/types';
import { X, Plus, Minus } from 'lucide-react';
import { generateId } from '../lib/grid-helpers';
import { getPieceColor, PIECE_COLORS } from '@/app/lib/piece-utils';

interface PieceCreatorProps {
  onClose: () => void;
  onCreatePiece: (piece: Piece) => void;
  editingPiece?: Piece | null;
}

export function PieceCreator({ onClose, onCreatePiece, editingPiece }: PieceCreatorProps) {
  const [pieceType, setPieceType] = useState<PieceType>(
    editingPiece?.type || PieceType.UNION
  );
  const [shape, setShape] = useState<number[][]>(
    editingPiece?.shape || [[1, 1], [1, 1]]
  );

  const toggleCell = (row: number, col: number) => {
    setShape((prev) =>
      prev.map((r, rIdx) => (rIdx === row ? r.map((c, cIdx) => (cIdx === col ? (c === 1 ? 0 : 1) : c)) : r))
    );
  };

  const addRow = (position: 'top' | 'bottom') => {
    const newRow = Array(shape[0].length).fill(0);
    setShape((prev) => (position === 'top' ? [newRow, ...prev] : [...prev, newRow]));
  };

  const addColumn = (position: 'left' | 'right') => {
    setShape((prev) =>
      prev.map((row) => (position === 'left' ? [0, ...row] : [...row, 0]))
    );
  };

  const removeRow = (position: 'top' | 'bottom') => {
    if (shape.length <= 1) return;
    setShape((prev) => (position === 'top' ? prev.slice(1) : prev.slice(0, -1)));
  };

  const removeColumn = (position: 'left' | 'right') => {
    if (shape[0].length <= 1) return;
    setShape((prev) =>
      prev.map((row) => (position === 'left' ? row.slice(1) : row.slice(0, -1)))
    );
  };

  const handleTypeChange = (newType: PieceType) => {
    setPieceType(newType);
  };

  const handleCreate = () => {
    const piece: Piece = {
      id: editingPiece?.id || generateId('piece'),
      type: pieceType,
      shape,
      position: editingPiece?.position || { x: 0, y: 0 },
    };
    onCreatePiece(piece);
    onClose();
  };

  const isShapeEmpty = shape.every((row) => row.every((cell) => cell === 0));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingPiece ? 'Edit Piece Shape' : 'Create New Piece'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Piece Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Piece Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleTypeChange(PieceType.UNION)}
                className={`px-4 py-3 border-2 rounded transition-all ${
                  pieceType === PieceType.UNION
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium" style={{ color: PIECE_COLORS[PieceType.UNION] }}>
                  UNION (OR)
                </div>
                <div className="text-xs text-gray-600">Blue - Adds coverage</div>
              </button>
              <button
                onClick={() => handleTypeChange(PieceType.XOR)}
                className={`px-4 py-3 border-2 rounded transition-all ${
                  pieceType === PieceType.XOR
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium" style={{ color: PIECE_COLORS[PieceType.XOR] }}>
                  XOR (Toggle)
                </div>
                <div className="text-xs text-gray-600">Red - Toggles coverage</div>
              </button>
              <button
                onClick={() => handleTypeChange(PieceType.INTERSECT)}
                className={`px-4 py-3 border-2 rounded transition-all ${
                  pieceType === PieceType.INTERSECT
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium" style={{ color: PIECE_COLORS[PieceType.INTERSECT] }}>
                  INTERSECT (AND)
                </div>
                <div className="text-xs text-gray-600">Amber - Intersection only</div>
              </button>
              <button
                onClick={() => handleTypeChange(PieceType.BLOCKER)}
                className={`px-4 py-3 border-2 rounded transition-all ${
                  pieceType === PieceType.BLOCKER
                    ? 'border-gray-500 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium" style={{ color: PIECE_COLORS[PieceType.BLOCKER] }}>
                  BLOCKER
                </div>
                <div className="text-xs text-gray-600">Gray - Blocks overlaps</div>
              </button>
            </div>
          </div>

          {/* Shape Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shape Editor</label>
            <div className="space-y-3">
              {/* Row controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => addRow('top')}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Row Top
                </button>
                <button
                  onClick={() => addRow('bottom')}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Row Bottom
                </button>
                <button
                  onClick={() => removeRow('top')}
                  disabled={shape.length <= 1}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded transition-colors flex items-center gap-1"
                >
                  <Minus className="w-3 h-3" /> Top
                </button>
                <button
                  onClick={() => removeRow('bottom')}
                  disabled={shape.length <= 1}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded transition-colors flex items-center gap-1"
                >
                  <Minus className="w-3 h-3" /> Bottom
                </button>
              </div>

              {/* Column controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => addColumn('left')}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Col Left
                </button>
                <button
                  onClick={() => addColumn('right')}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Col Right
                </button>
                <button
                  onClick={() => removeColumn('left')}
                  disabled={shape[0].length <= 1}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded transition-colors flex items-center gap-1"
                >
                  <Minus className="w-3 h-3" /> Left
                </button>
                <button
                  onClick={() => removeColumn('right')}
                  disabled={shape[0].length <= 1}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded transition-colors flex items-center gap-1"
                >
                  <Minus className="w-3 h-3" /> Right
                </button>
              </div>

              {/* Shape grid */}
              <div className="inline-block p-4 bg-gray-50 rounded border border-gray-200">
                <div
                  className="grid gap-1"
                  style={{
                    gridTemplateColumns: `repeat(${shape[0].length}, 40px)`,
                  }}
                >
                  {shape.map((row, r) =>
                    row.map((cell, c) => (
                      <button
                        key={`${r}-${c}`}
                        onClick={() => toggleCell(r, c)}
                        className="w-10 h-10 rounded border-2 transition-all"
                        style={{
                          backgroundColor: cell === 1 ? getPieceColor(pieceType) : 'white',
                          borderColor: cell === 1 ? getPieceColor(pieceType) : '#d1d5db',
                        }}
                      />
                    ))
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Click cells to toggle. Size: {shape[0].length}×{shape.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={isShapeEmpty}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded transition-colors"
          >
            {editingPiece ? 'Save Changes' : 'Create Piece'}
          </button>
        </div>
      </div>
    </div>
  );
}
