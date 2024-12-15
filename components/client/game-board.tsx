// components/client/game-board.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { GameBoard as GameBoardType } from '@/lib/types/game';
import type { GameBoardProps, UserPresence } from '@/lib/types/shared';
import { calculateNextGeneration, createEmptyBoard } from '@/utils/game';
import GameControls from './game-controls';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function GameBoard({ board: initialBoard, currentUser }: GameBoardProps) {
  // Parse dimensions from string (e.g., "10x10")
  const [width, height] = initialBoard.dimensions.split('x').map(Number);
  
  const [board, setBoard] = useState<boolean[][]>(() => 
    createEmptyBoard(width, height)
  );
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [userPresence, setUserPresence] = useState<UserPresence[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastToggled, setLastToggled] = useState<{x: number, y: number} | null>(null);
  
  const supabase = createClient();

  // Handle cell toggle with anti-bounce protection
  const toggleCell = useCallback((x: number, y: number) => {
    if (isRunning) return; // Prevent toggling while simulation is running
    
    // Skip if this cell was just toggled in the current drag
    if (lastToggled?.x === x && lastToggled?.y === y) return;
    
    setBoard(currentBoard => {
      const newBoard = currentBoard.map(row => [...row]);
      newBoard[y][x] = !newBoard[y][x];
      return newBoard;
    });
    setLastToggled({ x, y });
  }, [isRunning, lastToggled]);

  // Mouse event handlers
  const handleMouseDown = (x: number, y: number) => {
    if (isRunning) return;
    setIsDragging(true);
    toggleCell(x, y);
  };

  const handleMouseMove = (x: number, y: number) => {
    if (!isDragging || isRunning) return;
    toggleCell(x, y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setLastToggled(null);
  };

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

  // Global mouse up handler
  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

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
          Click and drag to draw cells, then use the controls to start the simulation.
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
                onMouseDown={() => handleMouseDown(x, y)}
                onMouseEnter={() => handleMouseMove(x, y)}
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