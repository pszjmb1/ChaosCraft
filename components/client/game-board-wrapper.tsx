'use client';

import dynamic from 'next/dynamic';
import { GameBoard as GameBoardType } from '@/lib/types/game';

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

interface GameBoardWrapperProps {
  initialBoard: GameBoardType;
}

export default function GameBoardWrapper({ initialBoard }: GameBoardWrapperProps) {
  return <GameBoard initialBoard={initialBoard} />;
}