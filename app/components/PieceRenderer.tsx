import React, { useRef, useEffect, useState } from 'react';
import { Piece, Position } from '../types';
import { getPieceColor } from '../lib/piece-utils';

interface PieceRendererProps {
    piece: Piece;
    cellSize: number;
    isDragging?: boolean;
    dragPosition?: { x: number, y: number };
    dragRotation?: number;
    dragFlipped?: boolean;
    violatingCells?: Position[];
    allowedCells?: Position[];
    moveId?: number;
    onPointerDown?: (e: React.PointerEvent) => void;
    style?: React.CSSProperties;
}

export const PieceRenderer: React.FC<PieceRendererProps> = ({
    piece,
    cellSize,
    isDragging = false,
    dragPosition,
    dragRotation = 0,
    dragFlipped = false,
    violatingCells = [],
    allowedCells = [],
    moveId = 0,
    onPointerDown,
    style
}) => {
    const displayColor = getPieceColor(piece.type);

    // Track state transitions for animation control
    const prevDragging = useRef(isDragging);
    const [justDropped, setJustDropped] = useState(false);
    
    useEffect(() => {
        if (prevDragging.current && !isDragging) {
            setJustDropped(true);
            const timer = setTimeout(() => setJustDropped(false), 50);
            return () => clearTimeout(timer);
        }
        prevDragging.current = isDragging;
    }, [isDragging]);

    const skipTransition = isDragging || justDropped;

    // Calculate position
    const posX = isDragging && dragPosition ? dragPosition.x : piece.position.x * cellSize;
    const posY = isDragging && dragPosition ? dragPosition.y : piece.position.y * cellSize;

    return (
        <div
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: piece.shape[0].length * cellSize,
                height: piece.shape.length * cellSize,
                pointerEvents: 'none',
                opacity: isDragging ? 0.8 : 1,
                zIndex: isDragging ? 50 : 10,
                transform: `translate(${posX}px, ${posY}px)`,
                transition: skipTransition ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1)',
                willChange: 'transform',
                ...style
            }}
            className="select-none"
        >
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInPiece {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                `
            }} />
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'grid',
                    gridTemplateRows: `repeat(${piece.shape.length}, 1fr)`,
                    gridTemplateColumns: `repeat(${piece.shape[0].length}, 1fr)`,
                    transform: isDragging ? `rotate(${dragRotation}deg) scaleX(${dragFlipped ? -1 : 1}) scale(1.05)` : 'rotate(0) scaleX(1) scale(1)',
                    transition: justDropped ? 'none' : 'transform 0.2s ease-out',
                    transformOrigin: 'center'
                }}
            >
                {piece.shape.map((row: number[], r: number) =>
                    row.map((cell: number, c: number) => {
                        if (cell !== 1) return <div key={`${r}-${c}`} style={{ width: '100%', height: '100%' }} />;

                        // Check neighbors to determine borders
                        const hasTop = r > 0 && piece.shape[r - 1][c] === 1;
                        const hasBottom = r < piece.shape.length - 1 && piece.shape[r + 1][c] === 1;
                        const hasLeft = c > 0 && piece.shape[r][c - 1] === 1;
                        const hasRight = c < piece.shape[0].length - 1 && piece.shape[r][c + 1] === 1;

                        const borderDark = '4px solid var(--piece-border)'; // Themed outline

                        const globalX = piece.position.x + c;
                        const globalY = piece.position.y + r;
                        const isThisCellViolating = violatingCells.some(vc => vc.x === globalX && vc.y === globalY);
                        const isThisCellAllowed = allowedCells.some(ac => ac.x === globalX && ac.y === globalY);

                        return (
                            <div 
                                key={`${r}-${c}`} 
                                onPointerDown={onPointerDown}
                                style={{ 
                                    width: '100%', 
                                    height: '100%',
                                    position: 'relative',
                                    pointerEvents: isDragging ? 'none' : 'auto', // Interactive pixels
                                    overflow: 'hidden'
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: displayColor,
                                        opacity: isThisCellViolating || isThisCellAllowed ? 0.6 : 1,
                                        width: '100%',
                                        height: '100%',
                                        boxSizing: 'border-box',
                                        // Thick borders on outer edges to outline the shape
                                        borderTop: hasTop ? undefined : borderDark,
                                        borderBottom: hasBottom ? undefined : borderDark,
                                        borderLeft: hasLeft ? undefined : borderDark,
                                        borderRight: hasRight ? undefined : borderDark,
                                        // Inner 3D bevel effect
                                        boxShadow: `
                                            inset 4px 4px 0px 0px rgba(255,255,255,0.4),
                                            inset -4px -4px 0px 0px rgba(0,0,0,0.2)
                                        `,
                                    }}
                                />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
