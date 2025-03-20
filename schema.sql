-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create waitlist_users table with security constraints
CREATE TABLE waitlist_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL CHECK (length(full_name) >= 2 AND length(full_name) <= 100),
    email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    signed_up_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ip_address INET,
    UNIQUE(email)
);

-- Create rate_limits table for protection against abuse
CREATE TABLE rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address INET NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 1,
    last_attempt TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(ip_address)
);

-- Create rate limiting function
CREATE OR REPLACE FUNCTION check_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM rate_limits
        WHERE ip_address = NEW.ip_address
        AND attempts >= 5
        AND last_attempt > now() - interval '1 minute'
    ) THEN
        RAISE EXCEPTION 'Rate limit exceeded';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for rate limiting
CREATE TRIGGER enforce_rate_limit
BEFORE INSERT ON waitlist_users
FOR EACH ROW
EXECUTE FUNCTION check_rate_limit();

-- Enable Row Level Security
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policies for waitlist_users
CREATE POLICY "Enable insert for all users" ON waitlist_users
    FOR INSERT
    WITH CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
        length(full_name) BETWEEN 2 AND 100 AND
        full_name ~ '^[a-zA-Z\s''-]+$'
    );

CREATE POLICY "Prevent direct select/update/delete" ON waitlist_users
    FOR ALL
    USING (false);

-- Create policies for rate_limits
CREATE POLICY "Enable upsert for all users" ON rate_limits
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Enable update for own IP" ON rate_limits
    FOR UPDATE
    USING (ip_address = current_setting('request.headers')::json->>'x-real-ip');

-- Create function to clean up old rate limits
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS void AS $$
BEGIN
    DELETE FROM rate_limits
    WHERE last_attempt < now() - interval '1 day';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to cleanup rate limits daily
SELECT cron.schedule(
    'cleanup-rate-limits',
    '0 0 * * *', -- Run at midnight every day
    'SELECT cleanup_rate_limits();'
);

-- Create indexes for performance
CREATE INDEX idx_waitlist_email ON waitlist_users(email);
CREATE INDEX idx_rate_limits_ip ON rate_limits(ip_address);
CREATE INDEX idx_rate_limits_last_attempt ON rate_limits(last_attempt);

-- Add comment for documentation
COMMENT ON TABLE waitlist_users IS 'Stores user information for the waitlist with security constraints';
COMMENT ON TABLE rate_limits IS 'Tracks rate limiting by IP address to prevent abuse';
