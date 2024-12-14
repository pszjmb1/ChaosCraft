// lib/types/game.ts

export interface GameBoard {
    id: string;
    name: string;
    dimensions: string;
    rules: string;
    current_state: string;
    version: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface UserParticipation {
    id: string;
    user_id: string;
    board_id: string;
    cursor_position: string | null;
    contributions: string | null;
    session_id: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface PatternEvolution {
    id: string;
    board_id: string;
    pattern: string;
    frequency: number;
    ai_suggestions: string | null;
    performance_metrics: string | null;
    evolution_history: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface GameState {
    board: boolean[][];
    generation: number;
    isRunning: boolean;
  }
  
  export type CellPosition = {
    x: number;
    y: number;
  };
  
  export interface GameRules {
    survive: number[];
    born: number[];
  }
  
  // Supabase Realtime Types
  export type RealtimeGameUpdate = {
    type: 'cell_update' | 'board_reset' | 'pattern_applied';
    data: {
      position?: CellPosition;
      state?: boolean;
      pattern?: boolean[][];
    };
  };