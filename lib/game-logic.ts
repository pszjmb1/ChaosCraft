export type Cell = 0 | 1;
export type Grid = Cell[][];

export function createEmptyGrid(rows: number, cols: number): Grid {
  return Array(rows).fill(0).map(() => Array(cols).fill(0));
}

export function getNeighborCount(grid: Grid, row: number, col: number): number {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const newRow = (row + i + rows) % rows;
      const newCol = (col + j + cols) % cols;
      count += grid[newRow][newCol];
    }
  }

  return count;
}

export function nextGeneration(grid: Grid): Grid {
  const rows = grid.length;
  const cols = grid[0].length;
  const newGrid = createEmptyGrid(rows, cols);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const neighbors = getNeighborCount(grid, row, col);
      const cell = grid[row][col];

      if (cell === 1 && (neighbors === 2 || neighbors === 3)) {
        newGrid[row][col] = 1;
      } else if (cell === 0 && neighbors === 3) {
        newGrid[row][col] = 1;
      }
    }
  }

  return newGrid;
}