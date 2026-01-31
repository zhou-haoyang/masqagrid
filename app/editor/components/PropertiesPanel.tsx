import { Region, Piece } from '@/app/types';
import { Trash2 } from 'lucide-react';
import { SymbolGridEditor } from './SymbolGridEditor';

interface PropertiesPanelProps {
  selectedItem: { type: 'region' | 'piece' | 'cell'; id: string } | null;
  regions: Region[];
  pieces: Piece[];
  onUpdateRegion: (id: string, updates: Partial<Region>) => void;
  onDeleteRegion: (id: string) => void;
  onUpdatePiece: (id: string, updates: Partial<Piece>) => void;
  onDeletePiece: (id: string) => void;
}

export function PropertiesPanel({
  selectedItem,
  regions,
  pieces,
  onUpdateRegion,
  onDeleteRegion,
  onUpdatePiece,
  onDeletePiece,
}: PropertiesPanelProps) {
  if (!selectedItem) {
    return (
      <div className="text-sm text-gray-500">
        No item selected. Click on a region or piece to edit its properties.
      </div>
    );
  }

  if (selectedItem.type === 'region') {
    const region = regions.find((r) => r.id === selectedItem.id);
    if (!region) return <div className="text-sm text-red-500">Region not found</div>;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Region</h3>
          <button
            onClick={() => onDeleteRegion(region.id)}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
            title="Delete region"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">ID</label>
            <input
              type="text"
              value={region.id}
              onChange={(e) => onUpdateRegion(region.id, { id: e.target.value })}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
            <select
              value={region.type}
              onChange={(e) =>
                onUpdateRegion(region.id, { type: e.target.value as Region['type'] })
              }
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
            >
              <option value="MAIN">MAIN</option>
              <option value="INVENTORY">INVENTORY</option>
              <option value="ALLOWED">ALLOWED</option>
              <option value="DISALLOWED">DISALLOWED</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">X</label>
              <input
                type="number"
                min="0"
                value={region.x}
                onChange={(e) => onUpdateRegion(region.id, { x: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Y</label>
              <input
                type="number"
                min="0"
                value={region.y}
                onChange={(e) => onUpdateRegion(region.id, { y: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Width</label>
              <input
                type="number"
                min="1"
                value={region.width}
                onChange={(e) =>
                  onUpdateRegion(region.id, { width: Math.max(1, parseInt(e.target.value) || 1) })
                }
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Height</label>
              <input
                type="number"
                min="1"
                value={region.height}
                onChange={(e) =>
                  onUpdateRegion(region.id, { height: Math.max(1, parseInt(e.target.value) || 1) })
                }
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>

          {(region.type === 'MAIN' ||
            region.type === 'ALLOWED' ||
            region.type === 'DISALLOWED') && (
            <div className="pt-3 border-t border-gray-200">
              <SymbolGridEditor
                region={region}
                onUpdate={(symbols) => onUpdateRegion(region.id, { symbols })}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (selectedItem.type === 'piece') {
    const piece = pieces.find((p) => p.id === selectedItem.id);
    if (!piece) return <div className="text-sm text-red-500">Piece not found</div>;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Piece</h3>
          <button
            onClick={() => onDeletePiece(piece.id)}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
            title="Delete piece"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">ID</label>
            <div className="text-sm text-gray-600">{piece.id}</div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
            <div className="text-sm text-gray-600">{piece.type}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">X</label>
              <div className="text-sm text-gray-600">{piece.position.x}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Y</label>
              <div className="text-sm text-gray-600">{piece.position.y}</div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Piece editing will be available in Phase 4. You can drag pieces on the canvas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-sm text-gray-500">Cell properties (coming in Phase 5)</div>
  );
}
