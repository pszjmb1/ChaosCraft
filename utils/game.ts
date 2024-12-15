import { GameRules } from '@/lib/types/game';

export const DEFAULT_RULES: GameRules = {
  born: [3],           // A dead cell becomes alive if it has exactly 3 live neighbours
  survive: [2, 3]      // A live cell survives if it has 2 or 3 live neighbours
};

/**
 * Creates an empty game board of specified dimensions
 */
export function createEmptyBoard(width: number, height: number): boolean[][] {
  return Array(height).fill(null).map(() => Array(width).fill(false));
}

/**
 * Calculates the next generation based on Conway's Game of Life rules
 */
export function calculateNextGeneration(
  currentBoard: boolean[][],
  rules: GameRules = DEFAULT_RULES
): boolean[][] {
  const height = currentBoard.length;
  const width = currentBoard[0].length;
  const nextBoard = createEmptyBoard(width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const neighbours = countLiveNeighbours(currentBoard, x, y);
      const isAlive = currentBoard[y][x];

      if (isAlive && rules.survive.includes(neighbours)) {
        nextBoard[y][x] = true;
      } else if (!isAlive && rules.born.includes(neighbours)) {
        nextBoard[y][x] = true;
      }
    }
  }

  return nextBoard;
}

/**
 * Counts live neighbours for a cell, including diagonal neighbours
 */
export function countLiveNeighbours(board: boolean[][], x: number, y: number): number {
  const height = board.length;
  const width = board[0].length;
  let count = 0;

  // Check all 8 neighbouring cells
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue; // Skip the cell itself
      
      // Use modulo for wrapping around edges
      const nx = (x + dx + width) % width;
      const ny = (y + dy + height) % height;
      
      if (board[ny][nx]) count++;
    }
  }

  return count;
}

/**
 * Serialises a board state to string format for storage
 */
export function serializeBoard(board: boolean[][]): string {
  return board.map(row => row.map(cell => cell ? '1' : '0').join('')).join('|');
}

/**
 * Deserialises a board state from string format
 */
export function deserializeBoard(serialized: string): boolean[][] {
  return serialized.split('|').map(row => 
    row.split('').map(cell => cell === '1')
  );
}