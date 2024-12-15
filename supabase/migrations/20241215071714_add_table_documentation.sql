-- Game Boards Table Documentation
COMMENT ON TABLE game_boards IS 'Core table storing Conway''s Game of Life board configurations and states';
COMMENT ON COLUMN game_boards.id IS 'Unique identifier for the game board';
COMMENT ON COLUMN game_boards.name IS 'User-friendly name for the board configuration';
COMMENT ON COLUMN game_boards.dimensions IS 'Board dimensions in format "width x height" (e.g., "10x10")';
COMMENT ON COLUMN game_boards.rules IS 'Game rules specification in B/S notation (e.g., "B3/S23" for classic Conway rules)';
COMMENT ON COLUMN game_boards.current_state IS 'Current board state serialised as string of 1s and 0s with rows separated by pipes';
COMMENT ON COLUMN game_boards.version IS 'Incremental version number for tracking board state changes';
COMMENT ON COLUMN game_boards.created_at IS 'Timestamp when the board was created';
COMMENT ON COLUMN game_boards.updated_at IS 'Timestamp of the last board update';
COMMENT ON CONSTRAINT version_check ON game_boards IS 'Ensures version numbers are always positive';

-- User Participation Table Documentation
COMMENT ON TABLE user_participation IS 'Tracks user participation and real-time interaction with game boards';
COMMENT ON COLUMN user_participation.id IS 'Unique identifier for the participation record';
COMMENT ON COLUMN user_participation.user_id IS 'Reference to auth.users table identifying the participant';
COMMENT ON COLUMN user_participation.board_id IS 'Reference to game_boards table identifying the board being accessed';
COMMENT ON COLUMN user_participation.cursor_position IS 'Real-time cursor position as JSON {x: number, y: number}';
COMMENT ON COLUMN user_participation.contributions IS 'JSON object tracking user interactions and contributions';
COMMENT ON COLUMN user_participation.session_id IS 'UUID for tracking active user sessions';
COMMENT ON COLUMN user_participation.created_at IS 'Timestamp when the user first joined the board';
COMMENT ON COLUMN user_participation.updated_at IS 'Timestamp of the last user activity';

-- Pattern Evolution Table Documentation
COMMENT ON TABLE pattern_evolution IS 'Tracks and analyses emerging patterns in game board states';
COMMENT ON COLUMN pattern_evolution.id IS 'Unique identifier for the pattern record';
COMMENT ON COLUMN pattern_evolution.board_id IS 'Reference to game_boards table identifying the source board';
COMMENT ON COLUMN pattern_evolution.pattern IS 'Serialised pattern representation using 1s and 0s';
COMMENT ON COLUMN pattern_evolution.frequency IS 'Number of times this pattern has been observed';
COMMENT ON COLUMN pattern_evolution.ai_suggestions IS 'JSON containing AI-generated suggestions for pattern evolution';
COMMENT ON COLUMN pattern_evolution.performance_metrics IS 'JSON containing pattern stability and performance metrics';
COMMENT ON COLUMN pattern_evolution.evolution_history IS 'JSON array tracking pattern changes over time';
COMMENT ON COLUMN pattern_evolution.created_at IS 'Timestamp when the pattern was first identified';
COMMENT ON COLUMN pattern_evolution.updated_at IS 'Timestamp of the last pattern update';
COMMENT ON CONSTRAINT frequency_check ON pattern_evolution IS 'Ensures frequency counts are never negative';

-- Scheduled Events Table Documentation
COMMENT ON TABLE scheduled_events IS 'Manages scheduled chaos events and board modifications';
COMMENT ON COLUMN scheduled_events.id IS 'Unique identifier for the event';
COMMENT ON COLUMN scheduled_events.board_id IS 'Reference to game_boards table identifying the target board';
COMMENT ON COLUMN scheduled_events.event_type IS 'Type of chaos event (e.g., "pattern_injection", "rule_change")';
COMMENT ON COLUMN scheduled_events.effects IS 'JSON describing the intended effects of the event';
COMMENT ON COLUMN scheduled_events.outcomes IS 'JSON describing the actual outcomes after event execution';
COMMENT ON COLUMN scheduled_events.event_history IS 'JSON array tracking event execution attempts and results';
COMMENT ON COLUMN scheduled_events.created_at IS 'Timestamp when the event was scheduled';
COMMENT ON COLUMN scheduled_events.updated_at IS 'Timestamp of the last event status update';

-- Analytics Table Documentation
COMMENT ON TABLE analytics IS 'Stores performance metrics and user engagement data';
COMMENT ON COLUMN analytics.id IS 'Unique identifier for the analytics record';
COMMENT ON COLUMN analytics.board_id IS 'Reference to game_boards table identifying the analysed board';
COMMENT ON COLUMN analytics.activity_metrics IS 'JSON containing board activity statistics';
COMMENT ON COLUMN analytics.performance_data IS 'JSON containing performance measurements and optimisation data';
COMMENT ON COLUMN analytics.user_engagement IS 'JSON tracking user interaction patterns and engagement metrics';
COMMENT ON COLUMN analytics.created_at IS 'Timestamp when analytics tracking began';
COMMENT ON COLUMN analytics.updated_at IS 'Timestamp of the last metrics update';

-- Add helpful views for documentation queries
CREATE OR REPLACE VIEW table_documentation AS
SELECT 
    t.table_name,
    pd.description as table_description,
    array_agg(
        json_build_object(
            'column', c.column_name,
            'description', cd.description
        ) ORDER BY c.ordinal_position
    ) as columns
FROM pg_catalog.pg_statio_all_tables AS st
INNER JOIN pg_catalog.pg_description pd ON st.relid = pd.objoid
INNER JOIN information_schema.tables t ON t.table_name = st.relname
INNER JOIN information_schema.columns c ON c.table_name = t.table_name
LEFT JOIN pg_catalog.pg_description cd ON 
    cd.objoid = st.relid AND 
    cd.objsubid = c.ordinal_position
WHERE t.table_schema = 'public'
GROUP BY t.table_name, pd.description;

COMMENT ON VIEW table_documentation IS 'Helper view for querying table and column documentation';