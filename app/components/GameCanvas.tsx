'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Level, Piece, PieceType } from '../types';
import { manageCollision } from '../lib/game-engine';
import { checkWinCondition, WinState } from '../lib/rules-engine'; // [NEW]
import { PieceRenderer } from './PieceRenderer';
import { RefreshCcw, Undo2, Trophy, AlertTriangle } from 'lucide-react'; // Added icons

interface GameCanvasProps {
    level: Level;
}

const CELL_SIZE = 40; // Pixels per cell

export const GameCanvas: React.FC<GameCanvasProps> = ({ level }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [pieces, setPieces] = useState<Piece[]>(initialPiecesWithIds(level.initialPieces));
    const [history, setHistory] = useState<Piece[][]>([]);
    const [winState, setWinState] = useState<WinState>({ isWin: false, violations: [] }); // [NEW]

    // Drag State
    const [draggedPieceId, setDraggedPieceId] = useState<string | null>(null);
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
        setDragOffset({ x: mouseX - pieceX, y: mouseY - pieceY });
        setDragPosition({ x: pieceX, y: pieceY });

        // Set capture to track outside div
        (e.target as Element).setPointerCapture(e.pointerId);
    };

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
            position: { x: dropGridX, y: dropGridY }
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
        const result = manageCollision(otherPieces, droppedPiece);

        if (result.success) {
            setHistory(prev => [...prev, previousState]);
            setPieces(result.newPieces);

            // Check Win [NEW]
            // We need to wait for state update? No, we have the new pieces.
            const newState = checkWinCondition(level, result.newPieces);
            setWinState(newState);
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
            setWinState(checkWinCondition(level, previous)); // Re-check
        }
    };

    const handleReset = () => {
        if (confirm("Reset Level?")) {
            const initial = initialPiecesWithIds(level.initialPieces);
            setPieces(initial);
            setHistory([]);
            setWinState(checkWinCondition(level, initial)); // Re-check
        }
    };

    // Check initial state on mount
    useEffect(() => {
        setWinState(checkWinCondition(level, pieces));
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

    const renderRegions = () => {
        return level.regions.map(region => (
            <div key={region.id}
                style={{
                    position: 'absolute',
                    left: region.x * CELL_SIZE,
                    top: region.y * CELL_SIZE,
                    width: region.width * CELL_SIZE,
                    height: region.height * CELL_SIZE,
                    backgroundColor: region.type === 'MAIN' ? '#f0f9ff' : // Light Blue
                        region.type === 'ALLOWED' ? '#dcfce7' : // Green-100
                            region.type === 'DISALLOWED' ? '#fee2e2' : // Red-100
                                '#f3f4f6', // Gray-100 (Inventory)
                    border: '2px solid rgba(0,0,0,0.1)',
                    display: 'grid',
                    gridTemplateColumns: `repeat(${region.width}, 1fr)`,
                    gridTemplateRows: `repeat(${region.height}, 1fr)`,
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#374151',
                    zIndex: 0
                }}
            >
                {/* Render Symbols if present */}
                {region.symbols && region.symbols.map((row, r) =>
                    row.map((symbol, c) => (
                        <div key={`${r}-${c}`} className="flex items-center justify-center">
                            {symbol}
                        </div>
                    ))
                )}
                {/* Label Overlay */}
                <div className="absolute -top-6 left-0 text-xs font-bold text-gray-500 uppercase tracking-wider bg-white px-2 rounded box-border whitespace-nowrap z-10">
                    {region.type}
                </div>
            </div>
        ));
    };

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
                <button onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                    <RefreshCcw size={16} /> Reset
                </button>
            </div>

            <p>Cover "Disallowed" symbols to break the rules involved.</p>

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

                {/* Layer 1: Regions (Symbols) */}
                {renderRegions()}

                {/* Layer 2: Pieces */}
                {pieces.map(piece => {
                    const isDragging = piece.id === draggedPieceId;
                    // If dragging, we render it at dragPosition, computed manually here
                    // Wait, PieceRenderer takes grid coordinates.
                    // We can cheat: PieceRenderer takes style overrides?
                    // Or we render a "Ghost" at the drag position and hide the real one.

                    if (isDragging) {
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
                                {/* Render raw shape without positioning logic since we wrapper it */}
                                {/* Actually PieceRenderer expects absolute grid positioning. Let's make a wrapper or use style props if support */}
                                {/* Re-using PieceRenderer logic slightly manually here for the dragged ghost */}
                                <div style={{
                                    width: piece.shape[0].length * CELL_SIZE,
                                    height: piece.shape.length * CELL_SIZE,
                                    display: 'grid',
                                    gridTemplateColumns: `repeat(${piece.shape[0].length}, 1fr)`,
                                    gridTemplateRows: `repeat(${piece.shape.length}, 1fr)`
                                }}>
                                    {piece.shape.map((row, r) => row.map((cell, c) => (
                                        <div key={`${r}-${c}`} className="w-full h-full">
                                            {cell === 1 && (
                                                <div style={{
                                                    backgroundColor: piece.color,
                                                    width: '100%', height: '100%',
                                                    opacity: 0.8,
                                                    borderRadius: 2
                                                }} />
                                            )}
                                        </div>
                                    )))}
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
