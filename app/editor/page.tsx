'use client';

import { useState, useEffect, useRef } from 'react';
import { Level, Region, Piece, Position, PieceType } from '../types';
import Link from 'next/link';
import { ArrowLeft, X } from 'lucide-react';
import { PropertiesPanel } from './components/PropertiesPanel';
import { PieceCreator } from './components/PieceCreator';
import { PieceContextMenu } from './components/PieceContextMenu';
import { ExportModal } from './components/ExportModal';
import { LoadLevelModal } from './components/LoadLevelModal';
import { PieceRenderer } from '../components/PieceRenderer';
import { pixelToGrid, generateId, CELL_SIZE } from './lib/grid-helpers';
import { validateLevel } from './lib/editor-utils';

interface EditorState {
  // Level data
  width: number;
  height: number;
  regions: Region[];
  pieces: Piece[];

  // Editor UI state
  selectedItem: { type: 'region' | 'piece' | 'cell'; id: string } | null;
  editorMode: 'select' | 'create-region';

  // Region creation
  regionDragStart: Position | null;
  regionDragEnd: Position | null;
  newRegionType: Region['type'] | null;

  // History
  history: Level[];
  historyIndex: number;
}

export default function LevelEditor() {
  const [width, setWidth] = useState(20);
  const [height, setHeight] = useState(15);
  const [regions, setRegions] = useState<Region[]>([]);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [selectedItem, setSelectedItem] = useState<EditorState['selectedItem']>(null);
  const [editorMode, setEditorMode] = useState<EditorState['editorMode']>('select');
  const [regionDragStart, setRegionDragStart] = useState<Position | null>(null);
  const [regionDragEnd, setRegionDragEnd] = useState<Position | null>(null);
  const [newRegionType, setNewRegionType] = useState<Region['type'] | null>(null);
  const [history, setHistory] = useState<Level[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showRegionTypeModal, setShowRegionTypeModal] = useState(false);
  const [showPieceCreator, setShowPieceCreator] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showLoadLevelModal, setShowLoadLevelModal] = useState(false);
  const [editingPiece, setEditingPiece] = useState<Piece | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    pieceId: string;
  } | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  // Piece dragging state
  const [draggedPieceId, setDraggedPieceId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState<Position>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  const saveToHistory = () => {
    const newLevel: Level = {
      id: 'editor-temp',
      width,
      height,
      regions,
      initialPieces: pieces,
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newLevel);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevLevel = history[historyIndex - 1];
      setWidth(prevLevel.width);
      setHeight(prevLevel.height);
      setRegions(prevLevel.regions);
      setPieces(prevLevel.initialPieces);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextLevel = history[historyIndex + 1];
      setWidth(nextLevel.width);
      setHeight(nextLevel.height);
      setRegions(nextLevel.regions);
      setPieces(nextLevel.initialPieces);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Region management handlers
  const handleAddRegionClick = () => {
    setShowRegionTypeModal(true);
  };

  const handleSelectRegionType = (type: Region['type']) => {
    setNewRegionType(type);
    setEditorMode('create-region');
    setShowRegionTypeModal(false);
  };

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (editorMode !== 'create-region' || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const gridPos = pixelToGrid(e.clientX, e.clientY, rect);

    // Clamp to grid bounds
    gridPos.x = Math.max(0, Math.min(width - 1, gridPos.x));
    gridPos.y = Math.max(0, Math.min(height - 1, gridPos.y));

    setRegionDragStart(gridPos);
    setRegionDragEnd(gridPos);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (editorMode !== 'create-region' || !regionDragStart || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const gridPos = pixelToGrid(e.clientX, e.clientY, rect);

    // Clamp to grid bounds
    gridPos.x = Math.max(0, Math.min(width - 1, gridPos.x));
    gridPos.y = Math.max(0, Math.min(height - 1, gridPos.y));

    setRegionDragEnd(gridPos);
  };

  const handleCanvasPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (editorMode !== 'create-region' || !regionDragStart || !regionDragEnd || !newRegionType)
      return;

    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    // Calculate region bounds
    const x = Math.min(regionDragStart.x, regionDragEnd.x);
    const y = Math.min(regionDragStart.y, regionDragEnd.y);
    const width = Math.abs(regionDragEnd.x - regionDragStart.x) + 1;
    const height = Math.abs(regionDragEnd.y - regionDragStart.y) + 1;

    // Create region
    const newRegion: Region = {
      id: generateId('region'),
      type: newRegionType,
      x,
      y,
      width,
      height,
      symbols:
        newRegionType === 'MAIN' || newRegionType === 'ALLOWED' || newRegionType === 'DISALLOWED'
          ? Array.from({ length: height }, () => Array(width).fill(''))
          : undefined,
    };

    saveToHistory();
    setRegions([...regions, newRegion]);
    setSelectedItem({ type: 'region', id: newRegion.id });

    // Reset region creation state
    setRegionDragStart(null);
    setRegionDragEnd(null);
    setNewRegionType(null);
    setEditorMode('select');
  };

  const handleUpdateRegion = (id: string, updates: Partial<Region>) => {
    setRegions((prev) =>
      prev.map((region) => {
        if (region.id !== id) return region;

        const updated = { ...region, ...updates };

        // If dimensions changed and region has symbols, resize symbol grid
        if (
          (updates.width !== undefined || updates.height !== undefined) &&
          updated.symbols
        ) {
          const newSymbols = Array.from({ length: updated.height }, (_, r) =>
            Array.from({ length: updated.width }, (_, c) => {
              return region.symbols?.[r]?.[c] || '';
            })
          );
          updated.symbols = newSymbols;
        }

        return updated;
      })
    );
    saveToHistory();
  };

  const handleDeleteRegion = (id: string) => {
    saveToHistory();
    setRegions((prev) => prev.filter((r) => r.id !== id));
    setSelectedItem(null);
  };

  const handleUpdatePiece = (id: string, updates: Partial<Piece>) => {
    setPieces((prev) => prev.map((piece) => (piece.id === id ? { ...piece, ...updates } : piece)));
    saveToHistory();
  };

  const handleDeletePiece = (id: string) => {
    saveToHistory();
    setPieces((prev) => prev.filter((p) => p.id !== id));
    setSelectedItem(null);
  };

  // Piece management handlers
  const handleAddPieceClick = () => {
    setShowPieceCreator(true);
    setEditingPiece(null);
  };

  const handleCreatePiece = (piece: Piece) => {
    saveToHistory();
    if (editingPiece) {
      // Update existing piece
      setPieces((prev) => prev.map((p) => (p.id === editingPiece.id ? piece : p)));
    } else {
      // Add new piece
      setPieces([...pieces, piece]);
      setSelectedItem({ type: 'piece', id: piece.id });
    }
    setEditingPiece(null);
  };

  const handleDuplicatePiece = (id: string) => {
    const piece = pieces.find((p) => p.id === id);
    if (!piece) return;

    const duplicate: Piece = {
      ...piece,
      id: generateId('piece'),
      position: { x: piece.position.x + 1, y: piece.position.y + 1 },
    };

    saveToHistory();
    setPieces([...pieces, duplicate]);
    setSelectedItem({ type: 'piece', id: duplicate.id });
  };

  const handleChangePieceType = (id: string, newType: PieceType) => {
    const defaultColors: Record<PieceType, string> = {
      [PieceType.UNION]: '#3b82f6',
      [PieceType.XOR]: '#ef4444',
      [PieceType.INTERSECT]: '#fbbf24',
      [PieceType.BLOCKER]: '#6b7280',
    };

    saveToHistory();
    setPieces((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, type: newType, color: defaultColors[newType] } : p
      )
    );
  };

  const handleEditPieceShape = (id: string) => {
    const piece = pieces.find((p) => p.id === id);
    if (piece) {
      setEditingPiece(piece);
      setShowPieceCreator(true);
    }
  };

  // Piece dragging handlers
  const handlePiecePointerDown = (e: React.PointerEvent, piece: Piece) => {
    if (editorMode !== 'select' || !canvasRef.current) return;

    e.stopPropagation();

    const rect = canvasRef.current.getBoundingClientRect();
    const pixelX = piece.position.x * CELL_SIZE;
    const pixelY = piece.position.y * CELL_SIZE;

    setDraggedPieceId(piece.id);
    setDragOffset({
      x: e.clientX - rect.left - pixelX,
      y: e.clientY - rect.top - pixelY,
    });
    setDragPosition({ x: pixelX, y: pixelY });
    setSelectedItem({ type: 'piece', id: piece.id });

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePiecePointerMove = (e: React.PointerEvent) => {
    if (!draggedPieceId || !canvasRef.current) return;

    e.stopPropagation();

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    setDragPosition({ x: newX, y: newY });
  };

  const handlePiecePointerUp = (e: React.PointerEvent) => {
    if (!draggedPieceId || !canvasRef.current) return;

    e.stopPropagation();
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    // Snap to grid
    const gridX = Math.round(dragPosition.x / CELL_SIZE);
    const gridY = Math.round(dragPosition.y / CELL_SIZE);

    // Bounds checking
    if (gridX >= 0 && gridY >= 0 && gridX < width && gridY < height) {
      saveToHistory();
      setPieces((prev) =>
        prev.map((p) =>
          p.id === draggedPieceId ? { ...p, position: { x: gridX, y: gridY } } : p
        )
      );
    }

    setDraggedPieceId(null);
  };

  const handlePieceContextMenu = (e: React.MouseEvent, piece: Piece) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, pieceId: piece.id });
  };

  // Validation and export handlers
  const handleValidate = () => {
    const currentLevel: Level = {
      id: 'editor-temp',
      width,
      height,
      regions,
      initialPieces: pieces,
    };

    const result = validateLevel(currentLevel);

    if (result.valid) {
      setValidationMessage(
        `✓ Validation passed! ${result.warnings.length > 0 ? `${result.warnings.length} warning(s)` : 'No warnings.'}`
      );
    } else {
      setValidationMessage(
        `✗ Validation failed. ${result.errors.length} error(s) found. Open Export to see details.`
      );
    }

    setTimeout(() => setValidationMessage(null), 5000);
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleLoadLevel = (level: Level) => {
    saveToHistory();
    setWidth(level.width);
    setHeight(level.height);
    setRegions(level.regions);
    setPieces(level.initialPieces);
    setSelectedItem(null);
  };

  // Calculate preview rectangle for region creation
  const getPreviewRect = () => {
    if (!regionDragStart || !regionDragEnd) return null;

    const x = Math.min(regionDragStart.x, regionDragEnd.x);
    const y = Math.min(regionDragStart.y, regionDragEnd.y);
    const w = Math.abs(regionDragEnd.x - regionDragStart.x) + 1;
    const h = Math.abs(regionDragEnd.y - regionDragStart.y) + 1;

    return { x, y, width: w, height: h };
  };

  const previewRect = getPreviewRect();

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Game</span>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900">Level Editor</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded transition-colors"
              title="Undo (Cmd+Z)"
            >
              Undo
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded transition-colors"
              title="Redo (Cmd+Shift+Z)"
            >
              Redo
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex max-w-screen-2xl mx-auto w-full">
        {/* Left Sidebar - Toolbox */}
        <aside className="w-64 bg-white border-r border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Toolbox</h2>

          {/* Grid Size Controls */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Grid Size</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Width</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={width}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setWidth(Math.max(1, Math.min(50, val)));
                  }}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Height</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={height}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setHeight(Math.max(1, Math.min(50, val)));
                  }}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={handleAddRegionClick}
                className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
              >
                Add Region
              </button>
              <button
                onClick={handleAddPieceClick}
                className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
              >
                Add Piece
              </button>
              <button
                onClick={() => setShowLoadLevelModal(true)}
                className="w-full px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-sm"
              >
                Load Level
              </button>
              <button
                onClick={handleValidate}
                className="w-full px-3 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors text-sm"
              >
                Validate
              </button>
              <button
                onClick={handleExport}
                className="w-full px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors text-sm"
              >
                Export
              </button>
            </div>
          </div>

          {editorMode === 'create-region' && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
              Creating {newRegionType} region. Click and drag on the canvas to create.
            </div>
          )}

          {validationMessage && (
            <div
              className={`mt-4 p-3 border rounded text-sm ${
                validationMessage.startsWith('✓')
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {validationMessage}
            </div>
          )}
        </aside>

        {/* Center - Canvas */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="relative inline-block">
              {/* Grid Canvas */}
              <div
                ref={canvasRef}
                className="relative bg-gray-50 border-2 border-gray-300"
                style={{
                  width: `${width * 40}px`,
                  height: `${height * 40}px`,
                  cursor: editorMode === 'create-region' ? 'crosshair' : 'default',
                }}
                onPointerDown={handleCanvasPointerDown}
                onPointerMove={handleCanvasPointerMove}
                onPointerUp={handleCanvasPointerUp}
              >
                {/* Grid Lines */}
                <svg
                  className="absolute inset-0 pointer-events-none"
                  width={width * 40}
                  height={height * 40}
                >
                  {/* Vertical lines */}
                  {Array.from({ length: width + 1 }).map((_, i) => (
                    <line
                      key={`v-${i}`}
                      x1={i * 40}
                      y1={0}
                      x2={i * 40}
                      y2={height * 40}
                      stroke="#d1d5db"
                      strokeWidth="1"
                    />
                  ))}
                  {/* Horizontal lines */}
                  {Array.from({ length: height + 1 }).map((_, i) => (
                    <line
                      key={`h-${i}`}
                      x1={0}
                      y1={i * 40}
                      x2={width * 40}
                      y2={i * 40}
                      stroke="#d1d5db"
                      strokeWidth="1"
                    />
                  ))}
                </svg>

                {/* Coordinate Labels */}
                {/* X-axis labels (top) */}
                {Array.from({ length: width }).map((_, i) => (
                  <div
                    key={`x-${i}`}
                    className="absolute text-xs text-gray-500 pointer-events-none"
                    style={{
                      left: `${i * 40 + 20}px`,
                      top: '-20px',
                      transform: 'translateX(-50%)',
                    }}
                  >
                    {i}
                  </div>
                ))}
                {/* Y-axis labels (left) */}
                {Array.from({ length: height }).map((_, i) => (
                  <div
                    key={`y-${i}`}
                    className="absolute text-xs text-gray-500 pointer-events-none"
                    style={{
                      left: '-24px',
                      top: `${i * 40 + 20}px`,
                      transform: 'translateY(-50%)',
                    }}
                  >
                    {i}
                  </div>
                ))}

                {/* Regions */}
                {regions.map((region) => (
                  <div
                    key={region.id}
                    className={`absolute border-2 cursor-pointer transition-all ${
                      selectedItem?.type === 'region' && selectedItem.id === region.id
                        ? 'ring-2 ring-offset-2 ring-blue-500'
                        : ''
                    }`}
                    style={{
                      left: `${region.x * 40}px`,
                      top: `${region.y * 40}px`,
                      width: `${region.width * 40}px`,
                      height: `${region.height * 40}px`,
                      backgroundColor:
                        region.type === 'MAIN'
                          ? 'rgba(219, 234, 254, 0.5)'
                          : region.type === 'INVENTORY'
                            ? 'rgba(243, 244, 246, 0.5)'
                            : region.type === 'ALLOWED'
                              ? 'rgba(220, 252, 231, 0.5)'
                              : 'rgba(254, 226, 226, 0.5)',
                      borderColor:
                        region.type === 'MAIN'
                          ? '#3b82f6'
                          : region.type === 'INVENTORY'
                            ? '#6b7280'
                            : region.type === 'ALLOWED'
                              ? '#10b981'
                              : '#ef4444',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (editorMode === 'select') {
                        setSelectedItem({ type: 'region', id: region.id });
                      }
                    }}
                  >
                    <div className="absolute -top-6 left-0 text-xs font-medium px-1 bg-white border rounded">
                      {region.type}
                    </div>
                  </div>
                ))}

                {/* Preview rectangle during region creation */}
                {previewRect && editorMode === 'create-region' && (
                  <div
                    className="absolute border-2 border-dashed pointer-events-none"
                    style={{
                      left: `${previewRect.x * 40}px`,
                      top: `${previewRect.y * 40}px`,
                      width: `${previewRect.width * 40}px`,
                      height: `${previewRect.height * 40}px`,
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      borderColor: '#3b82f6',
                    }}
                  >
                    <div className="absolute -top-6 left-0 text-xs font-medium px-1 bg-white border rounded">
                      {previewRect.width} × {previewRect.height}
                    </div>
                  </div>
                )}

                {/* Pieces */}
                {pieces.map((piece) => {
                  const isDragging = draggedPieceId === piece.id;
                  const position = isDragging ? dragPosition : {
                    x: piece.position.x * CELL_SIZE,
                    y: piece.position.y * CELL_SIZE,
                  };

                  return (
                    <div
                      key={piece.id}
                      className={`absolute ${
                        selectedItem?.type === 'piece' && selectedItem.id === piece.id
                          ? 'ring-2 ring-offset-2 ring-green-500'
                          : ''
                      }`}
                      style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        zIndex: isDragging ? 50 : 10,
                        opacity: isDragging ? 0.8 : 1,
                      }}
                      onPointerDown={(e) => handlePiecePointerDown(e, piece)}
                      onPointerMove={handlePiecePointerMove}
                      onPointerUp={handlePiecePointerUp}
                      onContextMenu={(e) => handlePieceContextMenu(e, piece)}
                    >
                      <PieceRenderer
                        piece={{ ...piece, position: { x: 0, y: 0 } }}
                        cellSize={CELL_SIZE}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <aside className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Properties</h2>
          <PropertiesPanel
            selectedItem={selectedItem}
            regions={regions}
            pieces={pieces}
            onUpdateRegion={handleUpdateRegion}
            onDeleteRegion={handleDeleteRegion}
            onUpdatePiece={handleUpdatePiece}
            onDeletePiece={handleDeletePiece}
          />
        </aside>
      </div>

      {/* Region Type Selection Modal */}
      {showRegionTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Region Type</h3>
              <button
                onClick={() => setShowRegionTypeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => handleSelectRegionType('MAIN')}
                className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded text-left transition-colors"
              >
                <div className="font-medium text-blue-900">MAIN</div>
                <div className="text-xs text-blue-700">The puzzle area with symbols</div>
              </button>
              <button
                onClick={() => handleSelectRegionType('INVENTORY')}
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-left transition-colors"
              >
                <div className="font-medium text-gray-900">INVENTORY</div>
                <div className="text-xs text-gray-700">Starting area for pieces</div>
              </button>
              <button
                onClick={() => handleSelectRegionType('ALLOWED')}
                className="w-full px-4 py-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded text-left transition-colors"
              >
                <div className="font-medium text-green-900">ALLOWED</div>
                <div className="text-xs text-green-700">Shows allowed symbols</div>
              </button>
              <button
                onClick={() => handleSelectRegionType('DISALLOWED')}
                className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded text-left transition-colors"
              >
                <div className="font-medium text-red-900">DISALLOWED</div>
                <div className="text-xs text-red-700">Shows disallowed symbols (violations)</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Piece Creator Modal */}
      {showPieceCreator && (
        <PieceCreator
          onClose={() => {
            setShowPieceCreator(false);
            setEditingPiece(null);
          }}
          onCreatePiece={handleCreatePiece}
          editingPiece={editingPiece}
        />
      )}

      {/* Piece Context Menu */}
      {contextMenu && (() => {
        const piece = pieces.find((p) => p.id === contextMenu.pieceId);
        return piece ? (
          <PieceContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            pieceId={contextMenu.pieceId}
            currentType={piece.type}
            onClose={() => setContextMenu(null)}
            onChangeType={(newType) => handleChangePieceType(contextMenu.pieceId, newType)}
            onEditShape={() => handleEditPieceShape(contextMenu.pieceId)}
            onDelete={() => handleDeletePiece(contextMenu.pieceId)}
            onDuplicate={() => handleDuplicatePiece(contextMenu.pieceId)}
          />
        ) : null;
      })()}

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          level={{
            id: 'editor-temp',
            width,
            height,
            regions,
            initialPieces: pieces,
          }}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Load Level Modal */}
      {showLoadLevelModal && (
        <LoadLevelModal
          onClose={() => setShowLoadLevelModal(false)}
          onLoad={handleLoadLevel}
        />
      )}
    </main>
  );
}
