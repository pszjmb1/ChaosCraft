-- Basic auth schema setup (if needed)
CREATE SCHEMA IF NOT EXISTS auth;

-- Grant basic schema access
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Ensure auth functions are available
CREATE OR REPLACE FUNCTION auth.uid() 
RETURNS uuid 
LANGUAGE sql 
STABLE 
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claim.sub', true),
    (current_setting('request.jwt.claims', true)::jsonb->>'sub')
  )::uuid
$$;