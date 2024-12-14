// lib/utils/game.ts

import { GameRules, CellPosition } from '@/lib/types/game';

export const DEFAULT_RULES: GameRules = {
  survive: [2, 3],
  born: [3]
};

export function createEmptyBoard(width: number, height: number): boolean[][] {
  return Array(height).fill(null).map(() => Array(width).fill(false));
}

export function calculateNextGeneration(
  currentBoard: boolean[][],
  rules: GameRules = DEFAULT_RULES
): boolean[][] {
  const height = currentBoard.length;
  const width = currentBoard[0].length;
  const nextBoard = createEmptyBoard(width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const neighbors = countNeighbors(currentBoard, x, y);
      const isAlive = currentBoard[y][x];
      
      if (isAlive && rules.survive.includes(neighbors)) {
        nextBoard[y][x] = true;
      } else if (!isAlive && rules.born.includes(neighbors)) {
        nextBoard[y][x] = true;
      }
    }
  }

  return nextBoard;
}

export function countNeighbors(board: boolean[][], x: number, y: number): number {
  const height = board.length;
  const width = board[0].length;
  let count = 0;

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      
      const ny = (y + dy + height) % height;
      const nx = (x + dx + width) % width;
      
      if (board[ny][nx]) count++;
    }
  }

  return count;
}

export function serializeBoard(board: boolean[][]): string {
  return board.map(row => row.map(cell => cell ? '1' : '0').join('')).join('|');
}

export function deserializeBoard(serialized: string): boolean[][] {
  return serialized.split('|').map(row => 
    row.split('').map(cell => cell === '1')
  );
}

export function validatePosition(pos: CellPosition, width: number, height: number): boolean {
  return pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height;
}

// Common patterns
export const PATTERNS = {
  glider: [
    [false, true, false],
    [false, false, true],
    [true, true, true]
  ],
  blinker: [
    [true, true, true]
  ],
  block: [
    [true, true],
    [true, true]
  ]
};