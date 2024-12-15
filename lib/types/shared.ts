// lib/types/shared.ts
import type { User } from '@supabase/supabase-js';
import { GameBoard } from './game';

export type GameBoardWrapperProps = {
  initialBoard: GameBoard;
  currentUser?: User | null;
};

export type GameBoardProps = {
  board: GameBoard;
  currentUser?: User | null;
  onCellToggle?: (x: number, y: number) => void;
};

export type UserPresence = {
  userId: string;
  cursorPosition?: { x: number; y: number };
  lastActive: string;
};

export type { User };