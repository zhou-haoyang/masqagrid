import React from 'react';
import { Piece } from '../types';

interface PieceRendererProps {
    piece: Piece;
    cellSize: number;
    isDragging?: boolean;
    onPointerDown?: (e: React.PointerEvent) => void;
    style?: React.CSSProperties;
}

export const PieceRenderer: React.FC<PieceRendererProps> = ({ piece, cellSize, isDragging, onPointerDown, style }) => {
    return (
        <div
            onPointerDown={onPointerDown}
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: piece.shape[0].length * cellSize,
                height: piece.shape.length * cellSize,
                pointerEvents: isDragging ? 'none' : 'auto',
                opacity: isDragging ? 0.8 : 1,
                zIndex: isDragging ? 50 : 10,
                transform: `translate(${piece.position.x * cellSize}px, ${piece.position.y * cellSize}px) ${isDragging ? 'scale(1.05)' : 'scale(1)'}`,
                transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1)',
                willChange: 'transform',
                ...style
            }}
            className="select-none"
        >
            <div
                style={{
                    display: 'grid',
                    gridTemplateRows: `repeat(${piece.shape.length}, 1fr)`,
                    gridTemplateColumns: `repeat(${piece.shape[0].length}, 1fr)`,
                    width: '100%',
                    height: '100%'
                }}
            >
                {piece.shape.map((row, r) =>
                    row.map((cell, c) => {
                        if (cell !== 1) return <div key={`${r}-${c}`} style={{ width: '100%', height: '100%' }} />;

                        // Check neighbors to determine borders
                        const hasTop = r > 0 && piece.shape[r - 1][c] === 1;
                        const hasBottom = r < piece.shape.length - 1 && piece.shape[r + 1][c] === 1;
                        const hasLeft = c > 0 && piece.shape[r][c - 1] === 1;
                        const hasRight = c < piece.shape[0].length - 1 && piece.shape[r][c + 1] === 1;

                        const borderStyle = '3px solid rgba(0,0,0,0.6)';

                        return (
                            <div key={`${r}-${c}`} style={{ width: '100%', height: '100%' }}>
                                <div
                                    style={{
                                        backgroundColor: piece.color,
                                        width: '100%',
                                        height: '100%',
                                        boxSizing: 'border-box',
                                        // Thick borders on outer edges
                                        borderTop: hasTop ? undefined : borderStyle,
                                        borderBottom: hasBottom ? undefined : borderStyle,
                                        borderLeft: hasLeft ? undefined : borderStyle,
                                        borderRight: hasRight ? undefined : borderStyle,
                                        // Internal grid lines
                                        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.2)', 
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
