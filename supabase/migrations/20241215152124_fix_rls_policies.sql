-- Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "select_user_participation" ON user_participation;
DROP POLICY IF EXISTS "insert_user_participation" ON user_participation;
DROP POLICY IF EXISTS "update_user_participation" ON user_participation;

-- Create new policies with optimised logic
CREATE POLICY "select_user_participation" ON user_participation
    FOR SELECT
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM game_boards
            WHERE game_boards.id = user_participation.board_id
        )
    );

CREATE POLICY "insert_user_participation" ON user_participation
    FOR INSERT
    WITH CHECK (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM game_boards
            WHERE game_boards.id = board_id
        )
    );

CREATE POLICY "update_user_participation" ON user_participation
    FOR UPDATE
    USING (
        user_id = auth.uid()
    )
    WITH CHECK (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM game_boards
            WHERE game_boards.id = board_id
        )
    );

-- Create function for safe user participation
CREATE OR REPLACE FUNCTION safe_record_participation(
    p_board_id uuid,
    p_session_id uuid DEFAULT uuid_generate_v4()
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO user_participation (
        user_id,
        board_id,
        session_id,
        contributions
    ) VALUES (
        auth.uid(),
        p_board_id,
        p_session_id,
        jsonb_build_object('joins', 1)
    )
    ON CONFLICT (user_id, board_id)
    DO UPDATE SET
        session_id = p_session_id,
        contributions = jsonb_build_object('joins', COALESCE((user_participation.contributions->>'joins')::int, 0) + 1),
        updated_at = now();
END;
$$;