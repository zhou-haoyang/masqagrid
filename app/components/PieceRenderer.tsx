import { Piece, Position } from '../types';
import { getPieceColor } from '../lib/piece-utils';

interface PieceRendererProps {
    piece: Piece;
    cellSize: number;
    isDragging?: boolean;
    violatingCells?: Position[];
    onPointerDown?: (e: React.PointerEvent) => void;
    style?: React.CSSProperties;
}

export const PieceRenderer: React.FC<PieceRendererProps> = ({ 
    piece, 
    cellSize, 
    isDragging, 
    violatingCells = [],
    onPointerDown, 
    style 
}) => {
    const displayColor = getPieceColor(piece.type);

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

                        const borderDark = '4px solid #111827'; // Dark outline

                        const globalX = piece.position.x + c;
                        const globalY = piece.position.y + r;
                        const isThisCellViolating = violatingCells.some(vc => vc.x === globalX && vc.y === globalY);

                        return (
                            <div key={`${r}-${c}`} style={{ width: '100%', height: '100%' }}>
                                <div
                                    style={{
                                        backgroundColor: displayColor,
                                        opacity: isThisCellViolating ? 0.6 : 1,
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
