import { createClient } from '@/utils/supabase/server';
import { GameBoard } from '@/lib/types/game';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function BoardsPage() {
  const supabase = await createClient();

  // Check authentication first
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect('/sign-in');
  }

  // Fetch boards with proper error handling
  const { data: boards, error: fetchError } = await supabase
    .from('game_boards')
    .select(`
      id,
      name,
      dimensions,
      rules,
      created_at,
      version
    `)
    .order('created_at', { ascending: false });

  if (fetchError) {
    console.error('Error fetching boards:', fetchError);
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-destructive">Unable to load game boards.</p>
          <p className="text-sm text-muted-foreground mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  const typedBoards = (boards || []) as GameBoard[];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Game Boards</h1>
        <Button asChild>
          <Link href="/board/new">Create New Board</Link>
        </Button>
      </div>

      {typedBoards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No game boards found.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Get started by creating your first board!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {typedBoards.map((board) => (
            <Card key={board.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{board.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Dimensions: {board.dimensions}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Rules: {board.rules}
                </p>
                <Button asChild variant="secondary" className="w-full">
                  <Link href={`/board/${board.id}`}>
                    Open Board
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}