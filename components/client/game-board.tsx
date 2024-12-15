'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { GameBoard as GameBoardType } from '@/lib/types/game';
import { calculateNextGeneration, createEmptyBoard } from '@/utils/game';
import GameControls from './game-controls';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface GameBoardProps {
  initialBoard: GameBoardType;
}

export default function GameBoard({ initialBoard }: GameBoardProps) {
  // Parse dimensions from string (e.g., "10x10")
  const [width, height] = initialBoard.dimensions.split('x').map(Number);
  
  const [board, setBoard] = useState<boolean[][]>(() => 
    createEmptyBoard(width, height)
  );
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Handle cell toggle
  const toggleCell = useCallback((x: number, y: number) => {
    if (isRunning) return; // Prevent toggling while simulation is running
    
    setBoard(currentBoard => {
      const newBoard = currentBoard.map(row => [...row]);
      newBoard[y][x] = !newBoard[y][x];
      return newBoard;
    });
  }, [isRunning]);

  // Next generation calculation
  const nextGen = useCallback(() => {
    setBoard(currentBoard => calculateNextGeneration(currentBoard));
    setGeneration(g => g + 1);
  }, []);

  // Simulation interval effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      intervalId = setInterval(nextGen, 500); // 2 generations per second
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, nextGen]);

  // Controls handlers
  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setBoard(createEmptyBoard(width, height));
    setGeneration(0);
  }, [width, height]);
  const handleStep = () => {
    if (!isRunning) nextGen();
  };

  // Error display
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <Alert className="mb-4 w-full">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Click cells to toggle their state, then use the controls to start the simulation.
        </AlertDescription>
      </Alert>

      <GameControls
        isRunning={isRunning}
        onStart={handleStart}
        onStop={handleStop}
        onReset={handleReset}
        onStep={handleStep}
        generation={generation}
      />

      <div className="grid gap-px bg-muted p-4 rounded-lg">
        {board.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => (
              <button
                key={`${x}-${y}`}
                className={`w-6 h-6 ${
                  cell ? 'bg-primary' : 'bg-background'
                } hover:bg-accent transition-colors`}
                onClick={() => toggleCell(x, y)}
                disabled={isRunning}
                aria-label={`Cell ${x},${y} ${cell ? 'alive' : 'dead'}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}