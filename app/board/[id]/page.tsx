import { createClient } from '@/utils/supabase/server';
import { GameBoard } from '@/lib/types/game';
import { notFound } from 'next/navigation';
import GameBoardWrapper from '@/components/client/game-board-wrapper';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface BoardPageProps {
  params: {
    id: string;
  };
}

export default async function BoardPage({ params }: BoardPageProps) {
  const supabase = await createClient();
  
  // Fetch board data with error handling
  const { data: board, error: boardError } = await supabase
    .from('game_boards')
    .select('*')
    .eq('id', params.id)
    .single();

  if (boardError || !board) {
    notFound();
  }

  // Create user participation record
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { error: participationError } = await supabase
      .from('user_participation')
      .upsert({
        user_id: user.id,
        board_id: params.id,
        session_id: crypto.randomUUID()
      }, {
        onConflict: 'user_id, board_id'
      });
    
    if (participationError) {
      console.error('Error recording participation:', participationError);
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

        <GameBoardWrapper initialBoard={board as GameBoard} />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Pattern Evolution</h2>
            {/* Pattern evolution stats will go here */}
          </div>
          <div className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Chaos Events</h2>
            {/* Upcoming chaos events will go here */}
          </div>
        </div>
      </div>
    </div>
  );
}