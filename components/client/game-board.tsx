'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Play, Pause, RotateCcw, Forward } from 'lucide-react';
import type { GameBoardProps } from '@/lib/types/shared';
import { calculateNextGeneration, createEmptyBoard } from '@/utils/game';

export default function GameBoard({ board: initialBoard, currentUser }: GameBoardProps) {
  // Parse dimensions from string (e.g., "10x10")
  const [width, height] = initialBoard.dimensions.split('x').map(Number);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State management
  const [board, setBoard] = useState<boolean[][]>(() => createEmptyBoard(width, height));
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastToggled, setLastToggled] = useState<{x: number, y: number} | null>(null);
  const [cellSize, setCellSize] = useState(20);

  const supabase = createClient();

  // Calculate cell size based on container size
  useEffect(() => {
    const updateCellSize = () => {
      if (!containerRef.current) return;

      // Get container dimensions (subtract padding and border)
      const containerWidth = containerRef.current.clientWidth - 48; // 24px padding on each side
      const containerHeight = containerRef.current.clientHeight - 48;

      // Calculate the maximum possible cell size that fits
      const maxCellWidth = Math.floor(containerWidth / width);
      const maxCellHeight = Math.floor(containerHeight / height);

      // Use the smaller dimension to maintain square cells
      let newSize = Math.min(maxCellWidth, maxCellHeight);

      // Apply size constraints
      newSize = Math.min(newSize, 35); // Maximum cell size
      newSize = Math.max(newSize, 18); // Minimum cell size

      setCellSize(newSize);
    };

    // Initial calculation
    updateCellSize();

    // Recalculate on window resize
    const resizeObserver = new ResizeObserver(updateCellSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [width, height]);

  // Game logic handlers
  const toggleCell = useCallback((x: number, y: number) => {
    if (isRunning) return;
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

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setLastToggled(null);
  }, []);

  // Next generation calculation
  const nextGen = useCallback(() => {
    setBoard(currentBoard => calculateNextGeneration(currentBoard));
    setGeneration(g => g + 1);
  }, []);

  // Simulation interval effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isRunning) {
      intervalId = setInterval(nextGen, 500);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, nextGen]);

  // Global mouse up handler
  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseUp]);

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

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Calculate total grid size
  const totalWidth = width * cellSize;
  const totalHeight = height * cellSize;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <Alert className="mb-4 w-full">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Click and drag to draw cells, then use the controls to start the simulation.
        </AlertDescription>
      </Alert>

      <div className="flex items-center gap-4 my-4 flex-wrap justify-center">
        <Button
          variant="default"
          size="default"
          onClick={isRunning ? handleStop : handleStart}
        >
          {isRunning ? (
            <Pause className="h-4 w-4 mr-2" />
          ) : (
            <Play className="h-4 w-4 mr-2" />
          )}
          {isRunning ? 'Stop' : 'Start'}
        </Button>

        <Button
          variant="outline"
          size="default"
          onClick={handleReset}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>

        <Button
          variant="outline"
          size="default"
          onClick={handleStep}
          disabled={isRunning}
        >
          <Forward className="h-4 w-4 mr-2" />
          Next Generation
        </Button>

        <span className="text-sm text-muted-foreground">
          Generation: {generation}
        </span>
      </div>

      {/* Board container with fixed aspect ratio */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-square bg-muted/50 rounded-lg flex items-center justify-center p-6"
      >
        {/* Grid container centred within the square container */}
        <div 
          className="relative bg-muted rounded-md p-4 shadow-inner"
          style={{
            width: `${totalWidth + 32}px`, // Add padding
            height: `${totalHeight + 32}px`,
          }}
        >
          {/* Actual grid with cells */}
          <div
            className="absolute inset-4" // Creates even padding
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
              gap: '1px',
              width: `${totalWidth}px`,
              height: `${totalHeight}px`,
            }}
          >
            {board.map((row, y) => 
              row.map((cell, x) => (
                <button
                  key={`${x}-${y}`}
                  className={`
                    transition-colors
                    ${cell ? 'bg-primary' : 'bg-background'}
                    hover:bg-accent
                    focus:outline-none focus:ring-2 focus:ring-primary
                  `}
                  onMouseDown={() => handleMouseDown(x, y)}
                  onMouseEnter={() => handleMouseMove(x, y)}
                  disabled={isRunning}
                  aria-label={`Cell ${x},${y} ${cell ? 'alive' : 'dead'}`}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}