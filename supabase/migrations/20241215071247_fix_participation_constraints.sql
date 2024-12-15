DROP POLICY IF EXISTS "Enable read access to board participants" ON user_participation;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_participation;
DROP POLICY IF EXISTS "Enable update for own records" ON user_participation;
DROP POLICY IF EXISTS "Enable delete for own records" ON user_participation;

-- Read policy: Users can see their own participation and others on boards they're on
CREATE POLICY "Enable read access to board participants"
ON user_participation
FOR SELECT
USING (
  -- Users can always see their own participation
  auth.uid() = user_id
  OR
  -- Users can see others' participation if they're on the same board
  EXISTS (
    SELECT 1 
    FROM game_boards gb
    WHERE gb.id = user_participation.board_id
    AND EXISTS (
      SELECT 1 
      FROM user_participation up2
      WHERE up2.board_id = gb.id
      AND up2.user_id = auth.uid()
    )
  )
);

-- Insert policy: Users can only insert their own records
CREATE POLICY "Enable insert for authenticated users"
ON user_participation
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Update policy: Users can only update their own records
CREATE POLICY "Enable update for own records"
ON user_participation
FOR UPDATE
USING (auth.uid() = user_id);

-- Delete policy: Users can only delete their own records
CREATE POLICY "Enable delete for own records"
ON user_participation
FOR DELETE
USING (auth.uid() = user_id);

-- Add function to update cursor position
CREATE OR REPLACE FUNCTION update_user_cursor(
  p_board_id uuid,
  p_x integer,
  p_y integer
)
RETURNS void AS $$
BEGIN
  INSERT INTO user_participation (user_id, board_id, cursor_position)
  VALUES (
    auth.uid(),
    p_board_id,
    jsonb_build_object('x', p_x, 'y', p_y)
  )
  ON CONFLICT (user_id, board_id)
  DO UPDATE SET
    cursor_position = jsonb_build_object('x', p_x, 'y', p_y),
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;