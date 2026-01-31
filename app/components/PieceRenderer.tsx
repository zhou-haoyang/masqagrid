import React from 'react';
import { Piece } from '../types';

interface PieceRendererProps {
    piece: Piece;
    cellSize: number;
    isDragging?: boolean;
}

export const PieceRenderer: React.FC<PieceRendererProps> = ({ piece, cellSize, isDragging }) => {
    return (
        <div
            style={{
                position: 'absolute',
                left: piece.position.x * cellSize,
                top: piece.position.y * cellSize,
                width: piece.shape[0].length * cellSize,
                height: piece.shape.length * cellSize,
                pointerEvents: isDragging ? 'none' : 'auto', // Pass through events when dragging ghost
                opacity: isDragging ? 0.8 : 1,
                zIndex: isDragging ? 50 : 10,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out, left 0.1s, top 0.1s'
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
