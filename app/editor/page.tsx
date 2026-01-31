'use client';

import { useState, useEffect, useRef } from 'react';
import { Level, Piece, PieceType } from '../types';
import Link from 'next/link';
import { ArrowLeft, Square, Hash, Grid3x3, CheckSquare, XSquare, Package } from 'lucide-react';
import { PieceCreator } from './components/PieceCreator';
import { PieceContextMenu } from './components/PieceContextMenu';
import { ExportModal } from './components/ExportModal';
import { LoadLevelModal } from './components/LoadLevelModal';
import { PieceRenderer } from '../components/PieceRenderer';
import { pixelToGrid, generateId, CELL_SIZE } from './lib/grid-helpers';

type BrushType = '.' | '#' | 'M' | 'A' | 'D' | 'I' | 'a' | 'd';

export default function LevelEditor() {
  // Level data
  const [id, setId] = useState('level-editor-' + Date.now());
  const [name, setName] = useState('Unnamed Level');
  const [width, setWidth] = useState(7);
  const [height, setHeight] = useState(7);
  const [grid, setGrid] = useState<string[]>(Array(15).fill('.'.repeat(20)));
  const [mainSymbols, setMainSymbols] = useState('');
  const [allowedSymbols, setAllowedSymbols] = useState('');
  const [disallowedSymbols, setDisallowedSymbols] = useState('');
  const [pieces, setPieces] = useState<Piece[]>([]);

  // Editor state
  const [selectedBrush, setSelectedBrush] = useState<BrushType>('M');
  const [isPainting, setIsPainting] = useState(false);
  const [showPieceCreator, setShowPieceCreator] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showLoadLevelModal, setShowLoadLevelModal] = useState(false);
  const [editingPiece, setEditingPiece] = useState<Piece | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    pieceId: string;
    currentType: PieceType;
  } | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  // Piece dragging state
  const [draggedPieceId, setDraggedPieceId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Adjust grid when dimensions change while preserving existing data
  useEffect(() => {
    setGrid(prevGrid => {
      const newGrid = Array(height).fill('.'.repeat(width));
      
      prevGrid.forEach((row, y) => {
        if (y < height) {
          const newRow = row.slice(0, width).padEnd(width, '.');
          newGrid[y] = newRow;
        }
      });
      
      return newGrid;
    });
  }, [width, height]);

  const handleClearGrid = () => {
    if (confirm('Are you sure you want to clear the entire grid?')) {
      setGrid(Array(height).fill('.'.repeat(width)));
    }
  };

  const handleClearPieces = () => {
    if (confirm('Are you sure you want to clear all pieces?')) {
      setPieces([]);
    }
  };

  // Paint cell with selected brush
  const paintCell = (x: number, y: number) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    
    const newGrid = [...grid];
    const row = newGrid[y].split('');
    row[x] = selectedBrush;
    newGrid[y] = row.join('');
    setGrid(newGrid);
  };

  // Canvas painting handlers
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
    
    setIsPainting(true);
    paintCell(x, y);
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPainting || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
    
    paintCell(x, y);
  };

  const handleCanvasPointerUp = () => {
    setIsPainting(false);
  };

  // Piece management
  const handleAddPieceClick = () => {
    setEditingPiece(null);
    setShowPieceCreator(true);
  };

  const handleCreatePiece = (piece: Piece) => {
    setPieces([...pieces, { ...piece, id: generateId() }]);
    setShowPieceCreator(false);
  };

  const handleDeletePiece = (id: string) => {
    setPieces(pieces.filter(p => p.id !== id));
    setContextMenu(null);
  };

  const handleDuplicatePiece = (id: string) => {
    const piece = pieces.find(p => p.id === id);
    if (piece) {
      const newPiece = {
        ...piece,
        id: generateId(),
        position: { x: piece.position.x + 2, y: piece.position.y + 2 }
      };
      setPieces([...pieces, newPiece]);
    }
    setContextMenu(null);
  };

  const handleChangePieceType = (id: string, newType: PieceType) => {
    setPieces(pieces.map(p => p.id === id ? { ...p, type: newType } : p));
    setContextMenu(null);
  };

  const handleEditPieceShape = (id: string) => {
    const piece = pieces.find(p => p.id === id);
    if (piece) {
      setEditingPiece(piece);
      setShowPieceCreator(true);
    }
    setContextMenu(null);
  };

  // Piece dragging
  const handlePiecePointerDown = (e: React.PointerEvent, piece: Piece) => {
    e.stopPropagation();
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const pieceX = piece.position.x * CELL_SIZE;
    const pieceY = piece.position.y * CELL_SIZE;

    setDraggedPieceId(piece.id);
    setDragOffset({ x: mouseX - pieceX, y: mouseY - pieceY });
    setDragPosition({ x: pieceX, y: pieceY });
  };

  const handlePiecePointerMove = (e: React.PointerEvent) => {
    if (!draggedPieceId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setDragPosition({
      x: mouseX - dragOffset.x,
      y: mouseY - dragOffset.y
    });
  };

  const handlePiecePointerUp = () => {
    if (!draggedPieceId) return;

    const gridPos = { 
      x: Math.round(dragPosition.x / CELL_SIZE), 
      y: Math.round(dragPosition.y / CELL_SIZE) 
    };
    setPieces(pieces.map(p =>
      p.id === draggedPieceId ? { ...p, position: gridPos } : p
    ));
    setDraggedPieceId(null);
  };

  const handlePieceContextMenu = (e: React.MouseEvent, piece: Piece) => {
    e.preventDefault();
    setContextMenu({ 
      x: e.clientX, 
      y: e.clientY, 
      pieceId: piece.id,
      currentType: piece.type 
    });
  };

  // Validation and export
  const handleValidate = () => {
    const level: Level = {
      id,
      name,
      width,
      height,
      grid,
      mainSymbols,
      allowedSymbols,
      disallowedSymbols,
      initialPieces: pieces
    };

    // Count cells
    let mCount = 0, aCount = 0, dCount = 0;
    grid.forEach(row => {
      for (const cell of row) {
        if (cell === 'M') mCount++;
        if (cell === 'A' || cell === 'a') aCount++;
        if (cell === 'D' || cell === 'd') dCount++;
      }
    });

    const mainClean = mainSymbols.replace(/[\n\r]/g, '');
    const allowedClean = allowedSymbols.replace(/[\n\r]/g, '');
    const disallowedClean = disallowedSymbols.replace(/[\n\r]/g, '');

    const errors = [];
    if (mCount === 0) errors.push('No Main (M) cells defined');
    if ([...mainClean].length !== mCount) errors.push(`Main symbols count (${[...mainClean].length}) doesn't match M cells (${mCount})`);
    if ([...allowedClean].length !== aCount) errors.push(`Allowed symbols count (${[...allowedClean].length}) doesn't match A/a cells (${aCount})`);
    if ([...disallowedClean].length !== dCount) errors.push(`Disallowed symbols count (${[...disallowedClean].length}) doesn't match D/d cells (${dCount})`);

    if (errors.length > 0) {
      setValidationMessage(errors.join('\\n'));
    } else {
      setValidationMessage('✓ Level is valid!');
    }
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleLoadLevel = (level: Level) => {
    console.log('Loading level:', level);
    setId(level.id);
    setName(level.name);
    setWidth(level.width);
    setHeight(level.height);
    setGrid(level.grid);
    setMainSymbols(level.mainSymbols);
    setAllowedSymbols(level.allowedSymbols);
    setDisallowedSymbols(level.disallowedSymbols);
    setPieces(level.initialPieces);
    setShowLoadLevelModal(false);
  };

  // Brush selector
  const brushes: { type: BrushType; label: string; icon: any; color: string }[] = [
    { type: '.', label: 'Empty', icon: Square, color: 'bg-white' },
    { type: '#', label: 'Blocked', icon: Hash, color: 'bg-gray-600 text-white' },
    { type: 'M', label: 'Main', icon: Grid3x3, color: 'bg-blue-400 text-white' },
    { type: 'A', label: 'Allowed', icon: CheckSquare, color: 'bg-green-400 text-white' },
    { type: 'a', label: 'B-Allowed', icon: CheckSquare, color: 'bg-green-600 text-white' },
    { type: 'D', label: 'Disallowed', icon: XSquare, color: 'bg-red-400 text-white' },
    { type: 'd', label: 'B-Disallowed', icon: XSquare, color: 'bg-red-600 text-white' },
    { type: 'I', label: 'Inventory', icon: Package, color: 'bg-purple-400 text-white' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-semibold">Level Editor</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowLoadLevelModal(true)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
            >
              Load Level
            </button>
            <button
              onClick={handleValidate}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Validate
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
            >
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar - Brushes */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <h2 className="font-semibold mb-4">Brushes</h2>
          <div className="grid grid-cols-2 gap-2">
            {brushes.map(brush => {
              const Icon = brush.icon;
              return (
                <button
                  key={brush.type}
                  onClick={() => setSelectedBrush(brush.type)}
                  className={`p-3 rounded border-2 transition ${
                    selectedBrush === brush.type
                      ? 'border-blue-500 ' + brush.color
                      : 'border-gray-200 hover:border-gray-300 ' + brush.color
                  }`}
                >
                  <Icon size={20} className="mx-auto mb-1" />
                  <div className="text-xs text-center">{brush.label}</div>
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <h2 className="font-semibold mb-2">Grid Size</h2>
            <div className="space-y-2">
              <div>
                <label className="text-sm">Width</label>
                <input
                  type="number"
                  value={width}
                  onChange={e => setWidth(Number(e.target.value))}
                  className="w-full px-2 py-1 border rounded"
                  min={5}
                  max={50}
                />
              </div>
              <div>
                <label className="text-sm">Height</label>
                <input
                  type="number"
                  value={height}
                  onChange={e => setHeight(Number(e.target.value))}
                  className="w-full px-2 py-1 border rounded"
                  min={5}
                  max={50}
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={handleClearGrid}
                className="w-full px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded transition-colors text-sm font-medium"
              >
                Clear Grid
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <button
              onClick={handleAddPieceClick}
              className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded"
            >
              Add Piece
            </button>
            <button
              onClick={handleClearPieces}
              className="w-full px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded transition-colors text-sm font-medium"
            >
              Clear Pieces
            </button>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 p-8 overflow-auto">
          <div
            ref={canvasRef}
            className="relative bg-white border-2 border-gray-300 select-none"
            style={{
              width: width * CELL_SIZE,
              height: height * CELL_SIZE,
              cursor: isPainting ? 'crosshair' : 'default',
              boxSizing: 'content-box'
            }}
            onPointerDown={handleCanvasPointerDown}
            onPointerMove={handleCanvasPointerMove}
            onPointerUp={handleCanvasPointerUp}
            onPointerLeave={handleCanvasPointerUp}
          >
            {/* Grid cells */}
            {(() => {
              // Count indices for each cell type in reading order
              let mIndex = 0, aIndex = 0, dIndex = 0;
              const mClean = [...mainSymbols.replace(/[\n\r]/g, '')];
              const aClean = [...allowedSymbols.replace(/[\n\r]/g, '')];
              const dClean = [...disallowedSymbols.replace(/[\n\r]/g, '')];

              return grid.map((row, y) =>
                row.split('').map((cell, x) => {
                  let bgColor = 'transparent';
                  let bgImage = 'none';
                  let symbol = '';

                  if (cell === 'M') {
                    bgColor = '#93c5fd'; // blue-300
                    symbol = mClean[mIndex] || '';
                    mIndex++;
                  } else if (cell === 'A' || cell === 'a') {
                    bgColor = '#86efac'; // green-300
                    symbol = aClean[aIndex] || '';
                    aIndex++;
                    if (cell === 'a') {
                      bgImage = 'repeating-linear-gradient(45deg, rgba(0,0,0,0.1) 0, rgba(0,0,0,0.1) 2px, transparent 2px, transparent 10px)';
                    }
                  } else if (cell === 'D' || cell === 'd') {
                    bgColor = '#fca5a5'; // red-300
                    symbol = dClean[dIndex] || '';
                    dIndex++;
                    if (cell === 'd') {
                      bgImage = 'repeating-linear-gradient(45deg, rgba(0,0,0,0.1) 0, rgba(0,0,0,0.1) 2px, transparent 2px, transparent 10px)';
                    }
                  } else if (cell === 'I') {
                    bgColor = '#d8b4fe'; // purple-300
                  } else if (cell === '#') {
                    bgColor = '#9ca3af'; // gray-400
                  }

                  return (
                    <div
                      key={`${y}-${x}`}
                      style={{
                        position: 'absolute',
                        left: x * CELL_SIZE,
                        top: y * CELL_SIZE,
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        backgroundColor: bgColor,
                        backgroundImage: bgImage,
                        border: '1px solid rgba(0,0,0,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#1f2937'
                      }}
                    >
                      {symbol}
                    </div>
                  );
                })
              );
            })()}

            {/* Pieces */}
            {pieces.map(piece => {
              const isDragging = piece.id === draggedPieceId;
              const pos = isDragging ? dragPosition : {
                x: piece.position.x * CELL_SIZE,
                y: piece.position.y * CELL_SIZE
              };

              return (
                <div
                  key={piece.id}
                  style={{
                    position: 'absolute',
                    left: pos.x,
                    top: pos.y,
                    cursor: 'move',
                    zIndex: isDragging ? 1000 : 10
                  }}
                  onPointerDown={e => handlePiecePointerDown(e, piece)}
                  onPointerMove={handlePiecePointerMove}
                  onPointerUp={handlePiecePointerUp}
                  onContextMenu={e => handlePieceContextMenu(e, piece)}
                >
                  <PieceRenderer
                    piece={{ ...piece, position: { x: 0, y: 0 } }}
                    cellSize={CELL_SIZE} />
                </div>
              );
            })}
          </div>

          {validationMessage && (
            <div className={`mt-4 p-4 rounded ${
              validationMessage.startsWith('✓') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <pre className="whitespace-pre-wrap">{validationMessage}</pre>
            </div>
          )}
        </div>

        {/* Right Sidebar - Symbol Streams */}
        <div className="w-80 bg-white border-l border-gray-200 p-4">
          <h2 className="font-semibold mb-4">Level Info</h2>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Level ID
            </label>
            <input
              type="text"
              value={id}
              onChange={e => setId(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm"
              placeholder="Enter level ID"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Level Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm"
              placeholder="Enter level name"
            />
          </div>

          <h2 className="font-semibold mb-4">Symbol Streams</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Main Symbols (M cells)
              </label>
              <textarea
                value={mainSymbols}
                onChange={e => setMainSymbols(e.target.value)}
                className="w-full px-3 py-2 border rounded font-mono text-sm"
                rows={3}
                placeholder="Enter symbols for M cells in reading order"
              />
              <div className="text-xs text-gray-500 mt-1">
                Length: {[...mainSymbols.replace(/[\n\r]/g, '')].length}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Allowed Symbols (A cells)
              </label>
              <input
                type="text"
                value={allowedSymbols}
                onChange={e => setAllowedSymbols(e.target.value)}
                className="w-full px-3 py-2 border rounded font-mono text-sm"
                placeholder="Enter symbols for A cells"
              />
              <div className="text-xs text-gray-500 mt-1">
                Length: {[...allowedSymbols.replace(/[\n\r]/g, '')].length}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Disallowed Symbols (D cells)
              </label>
              <input
                type="text"
                value={disallowedSymbols}
                onChange={e => setDisallowedSymbols(e.target.value)}
                className="w-full px-3 py-2 border rounded font-mono text-sm"
                placeholder="Enter symbols for D cells"
              />
              <div className="text-xs text-gray-500 mt-1">
                Length: {[...disallowedSymbols.replace(/[\n\r]/g, '')].length}
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 bg-blue-50 rounded text-sm">
            <p className="font-medium mb-1">How to use:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Select a brush and paint cells</li>
              <li>Enter symbols in reading order (left→right, top→bottom)</li>
              <li>Symbol count must match cell count</li>
              <li>Add pieces for the initial state</li>
              <li>Validate and export</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPieceCreator && (
        <PieceCreator
          onClose={() => setShowPieceCreator(false)}
          onCreatePiece={handleCreatePiece}
          editingPiece={editingPiece}
        />
      )}

      {showExportModal && (
        <ExportModal
          level={{
            id,
            name,
            width,
            height,
            grid,
            mainSymbols,
            allowedSymbols,
            disallowedSymbols,
            initialPieces: pieces
          }}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {showLoadLevelModal && (
        <LoadLevelModal
          onClose={() => setShowLoadLevelModal(false)}
          onLoad={handleLoadLevel}
        />
      )}

      {contextMenu && (
        <PieceContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          pieceId={contextMenu.pieceId}
          currentType={contextMenu.currentType}
          onClose={() => setContextMenu(null)}
          onDelete={() => handleDeletePiece(contextMenu.pieceId)}
          onDuplicate={() => handleDuplicatePiece(contextMenu.pieceId)}
          onChangeType={(type) => handleChangePieceType(contextMenu.pieceId, type)}
          onEditShape={() => handleEditPieceShape(contextMenu.pieceId)}
        />
      )}
    </div>
  );
}
