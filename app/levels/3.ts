import { Level, PieceType } from '../types';

export const LEVEL_3: Level = {
  id: 'editor-temp',
  width: 12,
  height: 9,
  regions: [
  {
    id: 'region-1769865733866-cloc191',
    type: 'MAIN',
    x: 0,
    y: 0,
    width: 9,
    height: 6,
    symbols: [
      ['✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅'],
      ['✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅'],
      ['✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅'],
      ['✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅'],
      ['✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅'],
      ['✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅']
    ]
  },
  {
    id: 'region-1769865791991-njmqp4q',
    type: 'ALLOWED',
    x: 9,
    y: 0,
    width: 3,
    height: 5,
    symbols: [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]
  },
  {
    id: 'region-1769865800650-orfgagz',
    type: 'DISALLOWED',
    x: 9,
    y: 5,
    width: 3,
    height: 4,
    symbols: [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]
  },
  {
    id: 'region-1769865805083-k7urtjb',
    type: 'INVENTORY',
    x: 0,
    y: 6,
    width: 9,
    height: 3
  }
  ],
  initialPieces: [
  {
    id: 'piece-1769865810138-fz2mifb',
    type: PieceType.UNION,
    color: '#3b82f6',
    position: { x: 0, y: 6 },
    shape: [[1,1],[1,1]]
  },
  {
    id: 'piece-1769865830095-kl3f487',
    type: PieceType.UNION,
    color: '#3b82f6',
    position: { x: 2, y: 6 },
    shape: [[1,1],[1,1]]
  }
  ]
};
