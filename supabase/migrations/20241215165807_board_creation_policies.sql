-- Add specific policy for board creation
CREATE POLICY "enable_board_creation_for_authenticated_users"
ON game_boards
FOR INSERT
TO authenticated
WITH CHECK (
  -- Ensure board name is not empty
  length(name) >= 3
  AND length(name) <= 50
  -- Validate dimensions format
  AND dimensions ~ '^[1-9][0-9]*x[1-9][0-9]*$'
  -- Validate rules format (B/S notation)
  AND rules ~ '^B[0-8]+/S[0-8]+$'
);

-- Add trigger to automatically track user participation on board creation
CREATE OR REPLACE FUNCTION public.handle_new_board()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_participation (
    user_id,
    board_id,
    session_id,
    contributions
  ) VALUES (
    auth.uid(),
    NEW.id,
    gen_random_uuid(),
    jsonb_build_object('created', true)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_board_created
  AFTER INSERT ON game_boards
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_board();