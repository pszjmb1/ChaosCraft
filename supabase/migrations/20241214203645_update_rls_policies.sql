-- Enable RLS on all tables
ALTER TABLE game_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_participation ENABLE ROW LEVEL SECURITY;
ALTER TABLE pattern_evolution ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Grant basic access to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Game Boards Policies
CREATE POLICY "select_game_boards" ON game_boards
    FOR SELECT
    USING (true);  -- All authenticated users can view boards

CREATE POLICY "insert_game_boards" ON game_boards
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "update_game_boards" ON game_boards
    FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM user_participation
        WHERE user_participation.board_id = id
        AND user_participation.user_id = auth.uid()
    ));

-- User Participation Policies
CREATE POLICY "select_user_participation" ON user_participation
    FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "insert_user_participation" ON user_participation
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "update_user_participation" ON user_participation
    FOR UPDATE
    USING (user_id = auth.uid());

-- Pattern Evolution Policies
CREATE POLICY "select_pattern_evolution" ON pattern_evolution
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM user_participation
        WHERE user_participation.board_id = pattern_evolution.board_id
        AND user_participation.user_id = auth.uid()
    ));

-- Scheduled Events Policies
CREATE POLICY "select_scheduled_events" ON scheduled_events
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM user_participation
        WHERE user_participation.board_id = scheduled_events.board_id
        AND user_participation.user_id = auth.uid()
    ));

-- Analytics Policies
CREATE POLICY "select_analytics" ON analytics
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM user_participation
        WHERE user_participation.board_id = analytics.board_id
        AND user_participation.user_id = auth.uid()
    ));