-- supabase/migrations/20241215071247_fix_participation_constraints.sql

-- Drop and recreate table with proper structure
DROP TABLE IF EXISTS user_participation CASCADE;

CREATE TABLE user_participation (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    board_id uuid NOT NULL REFERENCES game_boards(id) ON DELETE CASCADE,
    cursor_position jsonb,
    contributions jsonb,
    session_id uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT unique_user_board_participation UNIQUE (user_id, board_id)
);

-- Add indices for performance
CREATE INDEX idx_user_participation_user ON user_participation(user_id);
CREATE INDEX idx_user_participation_board ON user_participation(board_id);

-- Add updated_at trigger
CREATE TRIGGER update_user_participation_updated_at
    BEFORE UPDATE ON user_participation
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE user_participation ENABLE ROW LEVEL SECURITY;

-- Grant access to authenticated users
GRANT ALL ON user_participation TO authenticated;

-- RLS Policies
CREATE POLICY "Enable read for users participating in board"
    ON user_participation
    FOR SELECT
    USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM user_participation up
            WHERE up.board_id = user_participation.board_id
            AND up.user_id = auth.uid()
        )
    );

CREATE POLICY "Enable insert for authenticated users"
    ON user_participation
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users own records"
    ON user_participation
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users own records"
    ON user_participation
    FOR DELETE
    USING (auth.uid() = user_id);

-- Data validation triggers
CREATE OR REPLACE FUNCTION validate_cursor_position()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cursor_position IS NOT NULL 
       AND jsonb_typeof(NEW.cursor_position) != 'object' THEN
        RAISE EXCEPTION 'cursor_position must be a JSON object';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_valid_cursor_position
    BEFORE INSERT OR UPDATE ON user_participation
    FOR EACH ROW
    EXECUTE FUNCTION validate_cursor_position();