'use client';

// components/client/game-board-wrapper.tsx
import dynamic from 'next/dynamic';
import type { GameBoardWrapperProps } from '@/lib/types/shared';

const GameBoard = dynamic(
  () => import('./game-board'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Loading game board...
        </div>
      </div>
    )
  }
);

export default function GameBoardWrapper({ initialBoard, currentUser }: GameBoardWrapperProps) {
  return <GameBoard board={initialBoard} currentUser={currentUser} />;
}