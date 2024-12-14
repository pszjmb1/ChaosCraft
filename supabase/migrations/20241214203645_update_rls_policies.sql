-- supabase/migrations/20241214200000_update_rls_policies.sql

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "select_game_boards" ON game_boards;
DROP POLICY IF EXISTS "insert_game_boards" ON game_boards;

-- Allow users to see boards they participate in or have created
CREATE POLICY "select_game_boards" ON game_boards
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_participation
            WHERE user_participation.board_id = id
            AND user_participation.user_id = auth.uid()
        )
    );

-- Allow authenticated users to create boards
CREATE POLICY "insert_game_boards" ON game_boards
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Ensure user participation is created when a board is created
CREATE OR REPLACE FUNCTION public.handle_new_board()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_participation (user_id, board_id)
    VALUES (auth.uid(), NEW.id);
    RETURN NEW;
END;
$$ language plpgsql security definer;

-- Create trigger for new boards
DROP TRIGGER IF EXISTS on_board_created ON game_boards;
CREATE TRIGGER on_board_created
    AFTER INSERT ON game_boards
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_board();