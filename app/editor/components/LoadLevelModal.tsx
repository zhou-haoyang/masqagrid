import { X } from 'lucide-react';
import { LEVELS } from '@/app/levels';
import { Level } from '@/app/types';

interface LoadLevelModalProps {
  onClose: () => void;
  onLoad: (level: Level) => void;
}

export function LoadLevelModal({ onClose, onLoad }: LoadLevelModalProps) {
  const handleLoadLevel = (level: Level) => {
    onLoad(level);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Load Existing Level</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-sm text-gray-600 mb-4">
            Select a level to load as a template. You can then modify it and export as a new level.
          </p>

          <div className="space-y-2">
            {LEVELS.map((levelMeta) => (
              <button
                key={levelMeta.id}
                onClick={() => handleLoadLevel(levelMeta.level)}
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-left transition-colors"
              >
                <div className="font-medium text-gray-900">{levelMeta.name}</div>
                <div className="text-xs text-gray-600">
                  {levelMeta.level.width}×{levelMeta.level.height} grid,{' '}
                  {levelMeta.level.regions.length} regions, {levelMeta.level.initialPieces.length}{' '}
                  pieces
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-700 hover:bg-gray-200 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
