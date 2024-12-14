// components/client/game-board.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { GameState, GameBoard as GameBoardType } from '@/lib/types/game';
import { calculateNextGeneration, createEmptyBoard, serializeBoard, deserializeBoard } from '@/utils/game';

export interface GameBoardProps {
  initialBoard: GameBoardType;
}

export default function GameBoard({ initialBoard }: GameBoardProps) {
  // Defensive initialisation with fallbacks
  const boardDimensions = initialBoard?.dimensions?.split('x').map(Number) || [30, 30];
  const [width, height] = boardDimensions;
  
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: initialBoard?.current_state ? 
      deserializeBoard(initialBoard.current_state) : 
      createEmptyBoard(width, height),
    generation: 0,
    isRunning: false
  }));

  const [error, setError] = useState<string | null>(null);
  const [interval, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  const toggleCell = async (x: number, y: number) => {
    try {
      const newBoard = [...gameState.board];
      newBoard[y][x] = !newBoard[y][x];
      
      setGameState(prev => ({
        ...prev,
        board: newBoard
      }));

      const { error: updateError } = await supabase
        .from('game_boards')
        .update({
          current_state: serializeBoard(newBoard),
          version: initialBoard.version + 1
        })
        .eq('id', initialBoard.id);

      if (updateError) throw updateError;
    } catch (err) {
      setError('Failed to update cell state');
      console.error('Error updating cell:', err);
    }
  };

  const nextGeneration = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      board: calculateNextGeneration(prev.board),
      generation: prev.generation + 1
    }));
  }, []);

  const toggleSimulation = () => {
    setGameState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  // Setup simulation interval
  useEffect(() => {
    if (gameState.isRunning) {
      const id = setInterval(nextGeneration, 500);
      setIntervalId(id);
    } else if (interval) {
      clearInterval(interval);
      setIntervalId(null);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.isRunning, nextGeneration, interval]);

  // Setup real-time subscription
  useEffect(() => {
    if (!initialBoard?.id) return;

    const channel = supabase
      .channel(`game_board_${initialBoard.id}`)
      .on('postgres_changes', 
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_boards',
          filter: `id=eq.${initialBoard.id}`
        },
        (payload) => {
          const updatedBoard = payload.new as GameBoardType;
          if (updatedBoard.current_state) {
            setGameState(prev => ({
              ...prev,
              board: deserializeBoard(updatedBoard.current_state)
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialBoard?.id, supabase]);

  if (error) {
    return (
      <div className="p-4 text-destructive bg-destructive/10 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid gap-px bg-muted p-1 rounded-lg">
        {gameState.board.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => (
              <button
                key={`${x}-${y}`}
                className={`w-6 h-6 ${
                  cell ? 'bg-primary' : 'bg-background'
                } hover:bg-accent transition-colors`}
                onClick={() => toggleCell(x, y)}
                aria-label={`Cell ${x},${y} ${cell ? 'alive' : 'dead'}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-4 items-center">
        <button
          onClick={toggleSimulation}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          {gameState.isRunning ? 'Stop' : 'Start'}
        </button>
        <button
          onClick={nextGeneration}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
          disabled={gameState.isRunning}
        >
          Next Generation
        </button>
        <span className="text-sm text-muted-foreground">
          Generation: {gameState.generation}
        </span>
      </div>
    </div>
  );
}