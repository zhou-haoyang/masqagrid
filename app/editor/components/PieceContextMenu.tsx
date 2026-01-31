import { useEffect, useRef } from 'react';
import { PieceType } from '@/app/types';
import { Trash2, Edit, Copy } from 'lucide-react';

interface PieceContextMenuProps {
  x: number;
  y: number;
  pieceId: string;
  currentType: PieceType;
  onClose: () => void;
  onChangeType: (newType: PieceType) => void;
  onEditShape: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function PieceContextMenu({
  x,
  y,
  pieceId,
  currentType,
  onClose,
  onChangeType,
  onEditShape,
  onDelete,
  onDuplicate,
}: PieceContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-48"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      {/* Change Type submenu */}
      <div className="px-2 py-1">
        <div className="text-xs font-medium text-gray-500 px-2 py-1">Change Type</div>
        <button
          onClick={() => {
            onChangeType(PieceType.UNION);
            onClose();
          }}
          disabled={currentType === PieceType.UNION}
          className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-blue-500 font-medium">UNION</span>
          {currentType === PieceType.UNION && (
            <span className="ml-2 text-xs text-gray-500">(current)</span>
          )}
        </button>
        <button
          onClick={() => {
            onChangeType(PieceType.XOR);
            onClose();
          }}
          disabled={currentType === PieceType.XOR}
          className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-red-500 font-medium">XOR</span>
          {currentType === PieceType.XOR && (
            <span className="ml-2 text-xs text-gray-500">(current)</span>
          )}
        </button>
        <button
          onClick={() => {
            onChangeType(PieceType.INTERSECT);
            onClose();
          }}
          disabled={currentType === PieceType.INTERSECT}
          className="w-full px-3 py-2 text-left text-sm hover:bg-amber-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-amber-500 font-medium">INTERSECT</span>
          {currentType === PieceType.INTERSECT && (
            <span className="ml-2 text-xs text-gray-500">(current)</span>
          )}
        </button>
        <button
          onClick={() => {
            onChangeType(PieceType.BLOCKER);
            onClose();
          }}
          disabled={currentType === PieceType.BLOCKER}
          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-gray-600 font-medium">BLOCKER</span>
          {currentType === PieceType.BLOCKER && (
            <span className="ml-2 text-xs text-gray-500">(current)</span>
          )}
        </button>
      </div>

      <div className="border-t border-gray-200 my-1" />

      {/* Edit Shape */}
      <button
        onClick={() => {
          onEditShape();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded transition-colors flex items-center gap-2"
      >
        <Edit className="w-4 h-4" />
        Edit Shape
      </button>

      {/* Duplicate */}
      <button
        onClick={() => {
          onDuplicate();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded transition-colors flex items-center gap-2"
      >
        <Copy className="w-4 h-4" />
        Duplicate
      </button>

      <div className="border-t border-gray-200 my-1" />

      {/* Delete */}
      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded transition-colors flex items-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>
    </div>
  );
}
