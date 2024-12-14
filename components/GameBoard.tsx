'use client';

import { useCallback, useEffect, useState } from 'react';
import { Grid, createEmptyGrid, nextGeneration } from '@/lib/game-logic';
import { Button } from '@/components/ui/button';
import { Pause, Play, RotateCcw } from 'lucide-react';

interface GameBoardProps {
  rows?: number;
  cols?: number;
}

export default function GameBoard({ rows = 30, cols = 30 }: GameBoardProps) {
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid(rows, cols));
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);

  const toggleCell = useCallback((row: number, col: number) => {
    setGrid((currentGrid) => {
      const newGrid = currentGrid.map((rowArray) => [...rowArray]);
      newGrid[row][col] = newGrid[row][col] ? 0 : 1;
      return newGrid;
    });
  }, []);

  const reset = useCallback(() => {
    setGrid(createEmptyGrid(rows, cols));
    setGeneration(0);
    setIsRunning(false);
  }, [rows, cols]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        setGrid((currentGrid) => nextGeneration(currentGrid));
        setGeneration((gen) => gen + 1);
      }, 100);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="icon" onClick={reset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          Generation: {generation}
        </span>
      </div>
      <div
        className="grid gap-px bg-muted p-px rounded-lg shadow-inner"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1.5rem)`,
        }}
      >
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`w-6 h-6 rounded-sm transition-colors duration-200 cursor-pointer ${
                cell ? 'bg-primary' : 'bg-background hover:bg-secondary'
              }`}
              onClick={() => toggleCell(i, j)}
            />
          ))
        )}
      </div>
    </div>
  );
}