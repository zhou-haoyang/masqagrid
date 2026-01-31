'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Level, Piece, PieceType } from '../types';
import { manageCollision } from '../lib/game-engine';
import { rotateMatrix90, flipMatrixHorizontal } from '../lib/grid-utils';
import { parseLevel } from '../lib/level-parser';
import { checkWinCondition, WinState } from '../lib/rules-engine'; // [NEW]
import { PieceRenderer } from './PieceRenderer';
import { RefreshCcw, Undo2, Trophy, AlertTriangle, RotateCw, FlipHorizontal } from 'lucide-react'; // Added icons

interface GameCanvasProps {
    level: Level;
}

const CELL_SIZE = 40; // Pixels per cell

export const GameCanvas: React.FC<GameCanvasProps> = ({ level }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [pieces, setPieces] = useState<Piece[]>(initialPiecesWithIds(level.initialPieces));
    const [history, setHistory] = useState<Piece[][]>([]);
    const [winState, setWinState] = useState<WinState>({ isWin: false, violations: [] }); // [NEW]
    
    // Parse level grid into runtime structures
    const parsed = parseLevel(level);
    const { regions, symbolMap, gridCells } = parsed;

    // Drag State
    const [draggedPieceId, setDraggedPieceId] = useState<string | null>(null);
    const [draggedPieceShape, setDraggedPieceShape] = useState<number[][] | null>(null); // Track shape transformations
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Offset cursor -> top-left of piece (pixels)
    const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 }); // Current pixel position of top-left

    // Initial ID assignment
    function initialPiecesWithIds(ps: Piece[]) {
        return ps.map(p => ({ ...p, id: p.id || crypto.randomUUID() }));
    }

    // --- Interaction Handlers ---

    const handlePointerDown = (e: React.PointerEvent, piece: Piece) => {
        e.stopPropagation();
        e.preventDefault();
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const pieceX = piece.position.x * CELL_SIZE;
        const pieceY = piece.position.y * CELL_SIZE;

        setDraggedPieceId(piece.id);
        setDraggedPieceShape(piece.shape); // Initialize shape
        setDragOffset({ x: mouseX - pieceX, y: mouseY - pieceY });
        setDragPosition({ x: pieceX, y: pieceY });

        // Set capture to track outside div
        (e.target as Element).setPointerCapture(e.pointerId);
    };

    // Keyboard Listeners for Rotation/Flipping
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!draggedPieceId || !draggedPieceShape) return;

            if (e.code === 'Space' || e.code === 'KeyR') {
                e.preventDefault();
                setDraggedPieceShape(prev => prev ? rotateMatrix90(prev) : null);
            } else if (e.code === 'KeyF') {
                e.preventDefault();
                setDraggedPieceShape(prev => prev ? flipMatrixHorizontal(prev) : null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [draggedPieceId, draggedPieceShape]); // Depend on dragged IDs

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!draggedPieceId || !containerRef.current) return;
        e.preventDefault();

        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        setDragPosition({
            x: mouseX - dragOffset.x,
            y: mouseY - dragOffset.y
        });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!draggedPieceId) return;
        e.preventDefault();

        // Find the piece
        const originalPiece = pieces.find(p => p.id === draggedPieceId);
        if (!originalPiece) {
            setDraggedPieceId(null);
            return;
        }

        // Determine drop grid coordinates
        // Round to nearest cell
        const dropGridX = Math.round(dragPosition.x / CELL_SIZE);
        const dropGridY = Math.round(dragPosition.y / CELL_SIZE);

        // Create a temp piece at the new position
        const droppedPiece = {
            ...originalPiece,
            position: { x: dropGridX, y: dropGridY },
            shape: draggedPieceShape || originalPiece.shape // Use the transformed shape
        };

        // Store snapshot for Undo
        const previousState = [...pieces];

        // Check bounds (Rough check: is it generally inside the world?)
        // Actually engine handles collisions, but we should handle "out of bounds"
        if (dropGridX < 0 || dropGridY < 0 ||
            dropGridX + droppedPiece.shape[0].length > level.width ||
            dropGridY + droppedPiece.shape.length > level.height) {
            // Bounce back
            setDraggedPieceId(null);
            return;
        }

        // Run Engine
        // Remove the moved piece from the "other pieces" list before calculating collision
        const otherPieces = pieces.filter(p => p.id !== draggedPieceId);
        const result = manageCollision(otherPieces, droppedPiece, level.grid);

        if (result.success) {
            setHistory(prev => [...prev, previousState]);
            setPieces(result.newPieces);

            // Check Win [NEW]
            // We need to wait for state update? No, we have the new pieces.
            setWinState(checkWinCondition(regions, result.newPieces));
        } else {
            // Invalid move (Blocker collision etc) - Snap back is handled by state reset
        }

        setDraggedPieceId(null);
    };

    const handleUndo = () => {
        if (history.length === 0) return;
        const newHistory = [...history];
        const previous = newHistory.pop();
        setHistory(newHistory);
        if (previous) {
            setPieces(previous);
            setWinState(checkWinCondition(regions, previous)); // Re-check
        }
    };

    const handleReset = () => {
        if (confirm("Reset Level?")) {
            const initial = initialPiecesWithIds(level.initialPieces);
            setPieces(initial);
            setHistory([]);
            setWinState(checkWinCondition(regions, initial)); // Re-check
        }
    };

    // Check initial state on mount
    useEffect(() => {
        setWinState(checkWinCondition(regions, pieces));
    }, []); // Run once

    // --- Rendering Helpers ---

    const renderGridLines = () => {
        const lines = [];
        for (let i = 0; i <= level.width; i++) {
            lines.push(
                <div key={`v-${i}`} style={{
                    position: 'absolute', left: i * CELL_SIZE, top: 0, bottom: 0,
                    borderLeft: '1px solid #e5e5e5'
                }} />
            );
        }
        for (let i = 0; i <= level.height; i++) {
            lines.push(
                <div key={`h-${i}`} style={{
                    position: 'absolute', top: i * CELL_SIZE, left: 0, right: 0,
                    borderTop: '1px solid #e5e5e5'
                }} />
            );
        }
        return lines;
    };

    const renderGrid = () => {
        const cells = [];
        for (let y = 0; y < level.height; y++) {
            for (let x = 0; x < level.width; x++) {
                const cellType = gridCells[y]?.[x] || '.';
                const symbol = symbolMap.get(`${x},${y}`) || '';
                
                // Determine background color
                let bgColor = 'transparent';
                let bgImage = '';
                let border = 'none';
                
                if (cellType === 'M') {
                    bgColor = '#f0f9ff'; // Light Blue (Main)
                    border = '1px solid rgba(0,0,0,0.05)';
                } else if (cellType === 'A') {
                    bgColor = '#dcfce7'; // Green-100 (Allowed)
                    border = '1px solid rgba(0,0,0,0.05)';
                } else if (cellType === 'D') {
                    bgColor = '#fee2e2'; // Red-100 (Disallowed)
                    border = '1px solid rgba(0,0,0,0.05)';
                } else if (cellType === 'I') {
                    bgColor = '#f3f4f6'; // Gray-100 (Inventory)
                    border = '1px solid rgba(0,0,0,0.05)';
                } else if (cellType === '#') {
                    bgColor = '#ffffff';
                    bgImage = 'repeating-linear-gradient(45deg, #e5e7eb 0, #e5e7eb 2px, #ffffff 2px, #ffffff 10px)';
                    border = '1px solid #e5e5e5';
                }
                
                if (cellType !== '.') {
                    cells.push(
                        <div key={`cell-${y}-${x}`}
                            style={{
                                position: 'absolute',
                                left: x * CELL_SIZE,
                                top: y * CELL_SIZE,
                                width: CELL_SIZE,
                                height: CELL_SIZE,
                                backgroundColor: bgColor,
                                backgroundImage: bgImage,
                                border: border,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#374151',
                                zIndex: cellType === '#' ? 5 : 0
                            }}
                        >
                            {symbol}
                        </div>
                    );
                }
            }
        }
        return cells;
    };

    // Removed renderRegions - now using renderGrid

    return (
        <div className="flex flex-col items-center gap-4 p-8 select-none relative">
            {/* Status Panel */}
            <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg border transition-all z-50 ${winState.isWin ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                }`}>
                <div className="flex items-center gap-2 mb-2">
                    {winState.isWin ? (
                        <Trophy className="text-green-600" />
                    ) : (
                        <AlertTriangle className="text-amber-500" />
                    )}
                    <h3 className={`font-bold ${winState.isWin ? 'text-green-800' : 'text-gray-800'}`}>
                        {winState.isWin ? 'Level Cleared!' : 'Status'}
                    </h3>
                </div>

                {!winState.isWin && winState.violations.length > 0 && (
                    <div className="text-sm text-red-600">
                        <p className="font-semibold">Violations:</p>
                        <div className="flex gap-1 mt-1">
                            {winState.violations.map(v => (
                                <span key={v} className="px-2 py-0.5 bg-red-100 rounded border border-red-200 font-mono">
                                    {v}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {!winState.isWin && winState.violations.length === 0 && (
                    <div className="text-sm text-gray-500">
                        No immediate violations...
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="flex gap-4 mb-2">
                <button onClick={handleUndo} disabled={history.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50">
                    <Undo2 size={16} /> Undo
                </button>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded border border-gray-200 text-sm">
                   <RotateCw size={14} /> <span>Rotate: <b>R</b> / Space</span>
                   <span className="w-px h-4 bg-gray-300 mx-1"/>
                   <FlipHorizontal size={14} /> <span>Flip: <b>F</b></span>
                </div>
                <button onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                    <RefreshCcw size={16} /> Reset
                </button>
            </div>

            {/* Game Canvas Container */}
            <div
                ref={containerRef}
                className="relative bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200"
                style={{ width: level.width * CELL_SIZE, height: level.height * CELL_SIZE }}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                {/* Layer 0: Grid Lines */}
                {renderGridLines()}

                {/* Layer 1: Grid (Regions, Symbols, Blocked Cells) */}
                {renderGrid()}

                {/* Layer 2: Pieces */}
                {pieces.map(piece => {
                    const isDragging = piece.id === draggedPieceId;
                    
                    if (isDragging && draggedPieceShape) {
                        // Create a ghost piece object with the transformed shape
                        // We use the draggedPieceShape state
                        const ghostPiece = { ...piece, shape: draggedPieceShape };
                        return (
                            <div key={piece.id}
                                style={{
                                    position: 'absolute',
                                    left: dragPosition.x,
                                    top: dragPosition.y,
                                    zIndex: 100,
                                    pointerEvents: 'none' // Ghost doesn't catch events
                                }}
                            >
                                <div style={{
                                    width: draggedPieceShape[0].length * CELL_SIZE,
                                    height: draggedPieceShape.length * CELL_SIZE,
                                    // Use PieceRenderer logic indirectly or manually
                                    // Let's use PieceRenderer but hack the style to position it absolutely based on pixel
                                }}>
                                    {/* We can actually use PieceRenderer if we fake the ghost piece position to 0,0 and translate parent 
                                        BUT PieceRenderer expects Grid Coords. 
                                        So we stick to manual render for ghost OR wrap PieceRenderer
                                    */}
                                     {/* Re-using PieceRenderer but passing it a "Zeroed" piece and positioning the container */}
                                    <PieceRenderer 
                                        piece={{...ghostPiece, position: {x:0, y:0}}} 
                                        cellSize={CELL_SIZE} 
                                        isDragging={true}
                                    />
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={piece.id} onPointerDown={(e) => handlePointerDown(e, piece)}>
                            <PieceRenderer piece={piece} cellSize={CELL_SIZE} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
