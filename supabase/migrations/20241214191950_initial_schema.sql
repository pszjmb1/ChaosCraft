-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create tables
CREATE TABLE game_boards (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    dimensions text NOT NULL,
    rules text NOT NULL,
    current_state text NOT NULL,
    version int NOT NULL DEFAULT 1,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT version_check CHECK (version > 0)
);

CREATE TABLE user_participation (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid NOT NULL,
    board_id uuid NOT NULL REFERENCES game_boards(id) ON DELETE CASCADE,
    cursor_position text,
    contributions text,
    session_id uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE pattern_evolution (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    board_id uuid NOT NULL REFERENCES game_boards(id) ON DELETE CASCADE,
    pattern text NOT NULL,
    frequency int NOT NULL DEFAULT 0,
    ai_suggestions text,
    performance_metrics text,
    evolution_history text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT frequency_check CHECK (frequency >= 0)
);

CREATE TABLE scheduled_events (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    board_id uuid NOT NULL REFERENCES game_boards(id) ON DELETE CASCADE,
    event_type text NOT NULL,
    effects text,
    outcomes text,
    event_history text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE analytics (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    board_id uuid NOT NULL REFERENCES game_boards(id) ON DELETE CASCADE,
    activity_metrics text,
    performance_data text,
    user_engagement text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER update_game_boards_updated_at
    BEFORE UPDATE ON game_boards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_participation_updated_at
    BEFORE UPDATE ON user_participation
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pattern_evolution_updated_at
    BEFORE UPDATE ON pattern_evolution
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_events_updated_at
    BEFORE UPDATE ON scheduled_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_updated_at
    BEFORE UPDATE ON analytics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();