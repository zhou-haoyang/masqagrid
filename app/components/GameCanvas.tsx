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
    const [winState, setWinState] = useState<WinState>({ isWin: false, violations: [], violatingCells: [] }); // [NEW]

    // Parse level grid into runtime structures
    const parsed = parseLevel(level);
    const { regions, symbolMap, gridCells } = parsed;

    // Drag State
    const [draggedPieceId, setDraggedPieceId] = useState<string | null>(null);
    const [draggedPieceShape, setDraggedPieceShape] = useState<number[][] | null>(null); // Original shape when drag started
    const [dragRotation, setDragRotation] = useState(0);
    const [dragFlipped, setDragFlipped] = useState(false);
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
        setDraggedPieceShape(piece.shape); // Initialize shape with CURRENT state
        setDragRotation(0);
        setDragFlipped(false);
        setDragOffset({ x: mouseX - pieceX, y: mouseY - pieceY });
        setDragPosition({ x: pieceX, y: pieceY });

        // Set capture to track outside div
        (e.target as Element).setPointerCapture(e.pointerId);
    };

    // Keyboard Listeners for Rotation/Flipping/Undo
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Undo works anytime
            if (e.code === 'KeyZ') {
                e.preventDefault();
                handleUndo();
                return;
            }

            if (e.code == 'KeyC') {
                e.preventDefault();
                handleReset();
                return;
            }

            // Drag operations only work when dragging
            if (!draggedPieceId || !draggedPieceShape) return;

            if (e.code === 'KeyR') {
                e.preventDefault();
                setDragRotation(r => r + 90);
            } else if (e.code === 'KeyF') {
                e.preventDefault();
                setDragFlipped(f => !f);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [draggedPieceId, draggedPieceShape, history]);

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
        if (!originalPiece || !draggedPieceShape) {
            setDraggedPieceId(null);
            setDraggedPieceShape(null);
            return;
        }

        // Apply visual transforms to shape before dropping
        let finalShape = draggedPieceShape || originalPiece.shape;

        // Apply flip first if needed
        if (dragFlipped) {
            finalShape = flipMatrixHorizontal(finalShape);
        }

        // Apply rotation (normalized to 0-270)
        const normalizedRotation = ((dragRotation % 360) + 360) % 360;
        const rotations = normalizedRotation / 90;
        for (let i = 0; i < rotations; i++) {
            finalShape = rotateMatrix90(finalShape);
        }

        // Calculate visual shift if piece is rotated 90 or 270 degrees
        let shiftX = 0;
        let shiftY = 0;
        if (normalizedRotation === 90 || normalizedRotation === 270) {
            const W = (draggedPieceShape[0]?.length || 0);
            const H = draggedPieceShape.length;
            shiftX = (W - H) / 2 * CELL_SIZE;
            shiftY = (H - W) / 2 * CELL_SIZE;
        }

        // Determine drop grid coordinates from visual position
        const dropGridX = Math.round((dragPosition.x + shiftX) / CELL_SIZE);
        const dropGridY = Math.round((dragPosition.y + shiftY) / CELL_SIZE);

        // Create a temp piece at the new position
        const droppedPiece = {
            ...originalPiece,
            position: { x: dropGridX, y: dropGridY },
            shape: finalShape
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
            setDraggedPieceShape(null);
            setDragRotation(0);
            setDragFlipped(false);
            return;
        }

        // Run Engine
        // Remove the moved piece from the "other pieces" list before calculating collision
        const otherPieces = pieces.filter(p => p.id !== draggedPieceId);
        const result = manageCollision(otherPieces, droppedPiece, level.grid);

        // also check if piece actually changed position
        const changedPosition = originalPiece.position.x !== dropGridX || originalPiece.position.y !== dropGridY;

        if (result.success && changedPosition) {
            setHistory(prev => [...prev, previousState]);
            setPieces(result.newPieces);

            // Check Win [NEW]
            // We need to wait for state update? No, we have the new pieces.
            setWinState(checkWinCondition(regions, result.newPieces));
        } else {
            // Invalid move (Blocker collision etc) - Snap back is handled by state reset
        }

        setDraggedPieceId(null);
        setDraggedPieceShape(null);
        setDragRotation(0);
        setDragFlipped(false);
    };

    const handleUndo = () => {
        if (history.length === 0) return;

        // Reset drag state to re-enable transitions
        setDraggedPieceId(null);
        setDraggedPieceShape(null);
        setDragRotation(0);
        setDragFlipped(false);

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

    // [NEW] Track resolving cells for exit animation
    const [resolvingCells, setResolvingCells] = useState<{ x: number, y: number, id: string }[]>([]);
    const prevViolationsRef = useRef<typeof winState.violatingCells>([]);

    useEffect(() => {
        const prev = prevViolationsRef.current;
        const current = winState.violatingCells;

        // Find cells that were in prev but NOT in current
        const resolved = prev.filter(p => !current.some(c => c.x === p.x && c.y === p.y));

        if (resolved.length > 0) {
            const newResolving = resolved.map(p => ({ ...p, id: Math.random().toString(36).substr(2, 9) }));
            setResolvingCells(prev => [...prev, ...newResolving]);

            // Remove after animation
            setTimeout(() => {
                setResolvingCells(prev => prev.filter(p => !newResolving.some(nr => nr.id === p.id)));
            }, 1000);
        }

        prevViolationsRef.current = current;
    }, [winState.violatingCells]);

    // --- Rendering Helpers ---

    const renderGridLines = () => {
        const lines = [];
        for (let i = 0; i <= level.width; i++) {
            lines.push(
                <div key={`v-${i}`} style={{
                    position: 'absolute', left: i * CELL_SIZE, top: 0, bottom: 0,
                    borderLeft: '1px solid var(--grid-line)'
                }} />
            );
        }
        for (let i = 0; i <= level.height; i++) {
            lines.push(
                <div key={`h-${i}`} style={{
                    position: 'absolute', top: i * CELL_SIZE, left: 0, right: 0,
                    borderTop: '1px solid var(--grid-line)'
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
                    bgColor = 'var(--color-region-sky)';
                    border = '2px solid rgba(0,0,0,0.1)';
                } else if (cellType === 'A') {
                    bgColor = 'var(--color-region-grass)';
                    border = '2px solid rgba(0,0,0,0.1)';
                } else if (cellType === 'D') {
                    bgColor = 'var(--color-region-lava)';
                    border = '2px solid rgba(0,0,0,0.1)';
                } else if (cellType === 'I') {
                    bgColor = 'var(--color-region-wood)';
                    border = '2px solid rgba(0,0,0,0.1)';
                } else if (cellType === '#') {
                    bgColor = 'var(--color-wall)';
                    bgImage = 'repeating-linear-gradient(45deg, var(--color-wall-accent) 0, var(--color-wall-accent) 4px, var(--color-wall) 4px, var(--color-wall) 8px)';
                    border = '2px solid var(--foreground)';
                } else if (cellType === 'a') {
                    bgColor = 'var(--color-region-grass)';
                    bgImage = 'repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0, rgba(0,0,0,0.05) 2px, transparent 2px, transparent 10px)';
                    border = '2px solid rgba(0,0,0,0.1)';
                } else if (cellType === 'd') {
                    bgColor = 'var(--color-region-lava)';
                    bgImage = 'repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0, rgba(0,0,0,0.05) 2px, transparent 2px, transparent 10px)';
                    border = '2px solid rgba(0,0,0,0.1)';
                }

                const isViolating = winState.violatingCells.some(c => c.x === x && c.y === y);
                const isResolving = resolvingCells.some(c => c.x === x && c.y === y);

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
                                fontSize: '16px',
                                fontFamily: 'var(--font-pixel)',
                                color: 'var(--foreground)',
                                zIndex: isViolating ? 6 : (cellType === '#' ? 5 : 0),
                                boxSizing: 'border-box',
                                boxShadow: cellType === '#' ? 'inset 2px 2px 0 rgba(255,255,255,0.1), inset -2px -2px 0 rgba(0,0,0,0.3)' : 'none',
                                overflow: 'hidden', // Clip the ripple to the cell
                            }}
                        >
                            {/* Violation Overlay */}
                            {isViolating && (
                                <>
                                    {/* One-shot Ripple (Ring Shockwave) */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                        <div className="w-2 h-2 rounded-full animate-ripple"
                                            style={{
                                                background: 'radial-gradient(circle, transparent 20%, rgba(239,68,68,0.9) 40%, rgba(239,68,68,0) 70%)',
                                                animation: 'ripple-red 1s ease-out 1 forwards'
                                            }}
                                        />
                                    </div>

                                    {/* Delayed Persistent Border */}
                                    <div className="absolute inset-0 border-2 border-red-500/60 pointer-events-none z-10"
                                        style={{
                                            opacity: 0,
                                            animation: 'fadeIn 0.5s ease-out forwards'
                                        }}
                                    />
                                </>
                            )}

                            {/* Content */}
                            <span className="relative z-0">{symbol}</span>

                            {/* Resolve Animation (Green Ripple) */}
                            {isResolving && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                    <div className="w-2 h-2 rounded-full animate-ripple"
                                        style={{
                                            background: 'radial-gradient(circle, rgba(74,222,128,0.9) 0%, rgba(74,222,128,0) 70%)',
                                            animation: 'ripple-green 0.6s ease-out 1 forwards'
                                        }}
                                    />
                                </div>
                            )}
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
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulsate-red {
                    0% { border-color: rgba(239, 68, 68, 0.3); box-shadow: inset 0 0 2px rgba(239, 68, 68, 0.1); }
                    50% { border-color: rgba(239, 68, 68, 0.7); box-shadow: inset 0 0 8px rgba(239, 68, 68, 0.3); }
                    100% { border-color: rgba(239, 68, 68, 0.3); box-shadow: inset 0 0 2px rgba(239, 68, 68, 0.1); }
                }
                @keyframes ripple-red {
                    0% { transform: scale(1); opacity: 0.8; }
                    100% { transform: scale(12); opacity: 0; }
                }
                @keyframes ripple-green {
                    0% { transform: scale(1); opacity: 0.8; }
                    100% { transform: scale(12); opacity: 0; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}} />
            {/* Status Panel */}
            {/* Status Panel */}
            <div className={`fixed top-4 right-4 p-4 border-4 shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] transition-all z-50 ${winState.isWin ? 'bg-green-100 border-green-600' : 'bg-[var(--panel-bg)] border-[var(--panel-border)]'
                }`}>
                <div className="flex items-center gap-4 mb-2">
                    {winState.isWin ? (
                        <Trophy className="text-green-600" size={24} />
                    ) : (
                        <AlertTriangle className="text-amber-500" size={24} />
                    )}
                    <h3 className={`font-bold text-sm ${winState.isWin ? 'text-green-800' : 'text-[var(--panel-text)]'}`} style={{ textTransform: 'uppercase' }}>
                        {winState.isWin ? 'Level Cleared!' : 'Status'}
                    </h3>
                </div>

                {!winState.isWin && winState.violations.length > 0 && (
                    <div className="text-xs text-red-600">
                        <p className="font-bold mb-1">VIOLATIONS:</p>
                        <div className="flex flex-col gap-1 mt-1">
                            {winState.violations.map(v => (
                                <span key={v} className="px-1 bg-red-100 border-2 border-red-300 font-bold block w-fit">
                                    {v}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {!winState.isWin && winState.violations.length === 0 && (
                    <div className="text-xs text-gray-500 font-bold">
                        NO VIOLATIONS...
                    </div>
                )}
            </div>

            {/* Controls */}
            {/* Controls */}
            <div className="flex gap-4 mb-4">
                <button onClick={handleUndo} disabled={history.length === 0}
                    className="flex items-center gap-2 px-4 py-3 bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 border-b-4 border-gray-950 active:border-b-0 active:translate-y-1 font-bold text-xs uppercase shadow-md transition-all">
                    <Undo2 size={16} /> Undo (Z)
                </button>
                <div className="flex items-center gap-2 px-4 py-3 bg-[var(--panel-bg)] text-[var(--panel-text)] border-2 border-[var(--panel-border)] border-b-4 text-xs font-bold shadow-md">
                    <RotateCw size={14} /> <span>Rotate: R</span>
                    <span className="w-0.5 h-4 bg-gray-300 mx-2" />
                    <FlipHorizontal size={14} /> <span>Flip: F</span>
                </div>
                <button onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-3 bg-gray-200 text-gray-900 hover:bg-gray-300 border-b-4 border-gray-400 active:border-b-0 active:translate-y-1 font-bold text-xs uppercase shadow-md transition-all">
                    <RefreshCcw size={16} /> Reset (C)
                </button>
            </div>

            {/* Game Canvas Container */}
            <div
                ref={containerRef}
                className="relative bg-[var(--panel-bg)] shadow-[8px_8px_0_0_rgba(0,0,0,0.2)] border-4 border-[var(--panel-border)]"
                style={{
                    width: level.width * CELL_SIZE,
                    height: level.height * CELL_SIZE,
                    boxSizing: 'content-box'
                }}
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

                    // Construct style overrides for the dragging piece
                    // We keep the SAME Component instance for both dragging and non-dragging
                    // for the same piece ID, ensuring CSS transitions work.
                    const dragStyle: React.CSSProperties = isDragging ? {
                        transform: `translate(${dragPosition.x}px, ${dragPosition.y}px) rotate(${dragRotation}deg) scaleX(${dragFlipped ? -1 : 1}) scale(1.05)`,
                        zIndex: 100,
                        transition: 'transform 0.1s ease-out', // Subtle smoothing while dragging
                        transformOrigin: 'center'
                    } : {};

                    return (
                        <PieceRenderer
                            key={piece.id}
                            piece={isDragging ? { ...piece, shape: draggedPieceShape || piece.shape } : piece}
                            cellSize={CELL_SIZE}
                            isDragging={isDragging}
                            violatingCells={winState.violatingCells}
                            onPointerDown={isDragging ? undefined : (e: React.PointerEvent) => handlePointerDown(e, piece)}
                            style={dragStyle}
                        />
                    );
                })}
            </div>
        </div>
    );
};
