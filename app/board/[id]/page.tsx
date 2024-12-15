// app/board/[id]/page.tsx
import { createClient } from '@/utils/supabase/server';
import { GameBoard } from '@/lib/types/game';
import { notFound } from 'next/navigation';
import GameBoardWrapper from '@/components/client/game-board-wrapper';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface BoardPageProps {
  params: { id: string };
}

export default async function BoardPage({ params }: BoardPageProps) {
  const supabase = await createClient();
  const boardId = params.id; // Extract ID early to avoid async issues
  
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
      // Use the safe participation function
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