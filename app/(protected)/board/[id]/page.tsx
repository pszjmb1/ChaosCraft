// app/board/[id]/page.tsx
import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { GameBoard } from '@/lib/types/game';
import { notFound } from 'next/navigation';
import GameBoardWrapper from '@/components/client/game-board-wrapper';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { BoardSkeleton } from '@/components/board-skeleton';

interface BoardPageProps {
  params: Promise<{ id: string }> | { id: string };
}

async function BoardContent({ 
  boardId,
}: { 
  boardId: string;
}) {
  const supabase = await createClient();

  // Get board data first
  const { data: board, error: boardError } = await supabase
    .from('game_boards')
    .select('*')
    .eq('id', boardId)
    .single();

  if (boardError || !board) {
    console.error('Board error:', boardError);
    notFound();
  }

  // Get user after confirming board exists
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (user) {
    try {
      await supabase.rpc('safe_record_participation', {
        p_board_id: boardId,
        p_session_id: crypto.randomUUID()
      });
    } catch (error) {
      console.error('Participation error:', error);
      // Non-critical error, continue loading the board
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{board.name}</h1>
          <p className="text-muted-foreground">
            Dimensions: {board.dimensions} • Rules: {board.rules}
          </p>
        </div>
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This is a real-time collaborative board. All changes are synced with other players.
          </AlertDescription>
        </Alert>

        <GameBoardWrapper 
          initialBoard={board as GameBoard} 
          currentUser={user}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Pattern Evolution</h2>
            <p className="text-sm text-muted-foreground">
              Pattern analysis coming soon...
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Chaos Events</h2>
            <p className="text-sm text-muted-foreground">
              Next event scheduled soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function BoardPage({ params }: BoardPageProps) {
  // Await params here to handle async properly
  const resolvedParams = await params;
  
  return (
    <Suspense fallback={<BoardSkeleton />}>
      <BoardContent boardId={resolvedParams.id} />
    </Suspense>
  );
}