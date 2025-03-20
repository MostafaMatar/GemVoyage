-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create waitlist_users table with security constraints
CREATE TABLE waitlist_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL CHECK (length(full_name) >= 2 AND length(full_name) <= 100),
    email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    signed_up_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(email)
);

-- Enable Row Level Security
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;

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

-- Create index for performance
CREATE INDEX idx_waitlist_email ON waitlist_users(email);

-- Add comment for documentation
COMMENT ON TABLE waitlist_users IS 'Stores user information for the waitlist with security constraints';
