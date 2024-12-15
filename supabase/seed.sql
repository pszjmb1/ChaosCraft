-- Begin transaction
BEGIN;

-- Insert initial game boards
INSERT INTO public.game_boards (
    id,
    name,
    dimensions,
    rules,
    current_state,
    version
) VALUES 
    (
        'b0d1e8f2-3a4c-5b6d-7e8f-9a0b1c2d3e4f'::uuid,
        'Conway Classic',
        '10x10',
        'B3/S23',  -- Standard Conway rules
        '0000000000|0000000000|0000000000|0000000000|0000000000|0000000000|0000000000|0000000000|0000000000|0000000000',
        1
    ),
    (
        'c1e2f3a4-5b6c-7d8e-9f0a-1b2c3d4e5f6a'::uuid,
        'HighLife Extended',
        '20x20',
        'B36/S23', -- HighLife rules
        repeat('0|', 19) || '0',
        1
    );

-- We'll skip user_participation for now as it requires an authenticated user
-- This will be handled through the application when users authenticate

-- Add sample pattern evolution data
INSERT INTO public.pattern_evolution (
    board_id,
    pattern,
    frequency,
    ai_suggestions
) VALUES 
    (
        'b0d1e8f2-3a4c-5b6d-7e8f-9a0b1c2d3e4f'::uuid,
        '010|001|111',
        1,
        'Try adding a blinker pattern'
    ),
    (
        'c1e2f3a4-5b6c-7d8e-9f0a-1b2c3d4e5f6a'::uuid,
        '111',
        1,
        'Consider evolving to a pulsar'
    );

-- Add initial analytics entries
INSERT INTO public.analytics (
    board_id,
    activity_metrics,
    performance_data
) VALUES 
    (
        'b0d1e8f2-3a4c-5b6d-7e8f-9a0b1c2d3e4f'::uuid,
        '{"views": 0, "interactions": 0}',
        '{"avgGenerationTime": 0}'
    ),
    (
        'c1e2f3a4-5b6c-7d8e-9f0a-1b2c3d4e5f6a'::uuid,
        '{"views": 0, "interactions": 0}',
        '{"avgGenerationTime": 0}'
    );

COMMIT;