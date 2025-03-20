-- Create application roles
CREATE ROLE gemvoyage_admin;
CREATE ROLE gemvoyage_api;
CREATE ROLE gemvoyage_readonly;

-- Grant privileges to admin role
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO gemvoyage_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO gemvoyage_admin;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO gemvoyage_admin;

-- Set up API role with limited permissions
GRANT gemvoyage_api TO authenticator;
GRANT USAGE ON SCHEMA public TO gemvoyage_api;

-- Waitlist users table permissions
GRANT INSERT ON waitlist_users TO gemvoyage_api;
GRANT SELECT ON SEQUENCE waitlist_users_id_seq TO gemvoyage_api;

-- Rate limits table permissions
GRANT SELECT, INSERT, UPDATE ON rate_limits TO gemvoyage_api;
GRANT SELECT ON SEQUENCE rate_limits_id_seq TO gemvoyage_api;

-- Read-only role for analytics
GRANT USAGE ON SCHEMA public TO gemvoyage_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO gemvoyage_readonly;

-- Revoke public permissions
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC;

-- Create security definer function for insertions
CREATE OR REPLACE FUNCTION insert_waitlist_user(
    p_full_name TEXT,
    p_email TEXT,
    p_ip_address INET
)
RETURNS UUID
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Validate inputs
    IF NOT (p_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') THEN
        RAISE EXCEPTION 'Invalid email format';
    END IF;

    IF NOT (p_full_name ~ '^[a-zA-Z\s''-]{2,100}$') THEN
        RAISE EXCEPTION 'Invalid name format';
    END IF;

    -- Insert with explicit permissions
    INSERT INTO waitlist_users (full_name, email, ip_address)
    VALUES (p_full_name, lower(p_email), p_ip_address)
    RETURNING id INTO v_user_id;

    RETURN v_user_id;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION insert_waitlist_user TO gemvoyage_api;

-- Create additional security policies
ALTER TABLE waitlist_users FORCE ROW LEVEL SECURITY;
ALTER TABLE rate_limits FORCE ROW LEVEL SECURITY;

-- Create policies for rate_limits
CREATE POLICY "api_insert_rate_limits" ON rate_limits
    FOR INSERT
    TO gemvoyage_api
    WITH CHECK (true);

CREATE POLICY "api_update_rate_limits" ON rate_limits
    FOR UPDATE
    TO gemvoyage_api
    USING (true)
    WITH CHECK (
        last_attempt >= now() - interval '1 minute' AND
        attempts <= 5
    );

-- Add audit logging
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    user_id TEXT,
    ip_address INET,
    old_data JSONB,
    new_data JSONB
);

-- Create audit function
CREATE OR REPLACE FUNCTION audit_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (
        action,
        table_name,
        user_id,
        ip_address,
        old_data,
        new_data
    )
    VALUES (
        TG_OP,
        TG_TABLE_NAME,
        current_user,
        inet_client_addr(),
        row_to_json(OLD),
        row_to_json(NEW)
    );
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit trigger to waitlist_users
CREATE TRIGGER waitlist_audit
AFTER INSERT OR UPDATE OR DELETE ON waitlist_users
FOR EACH ROW EXECUTE FUNCTION audit_changes();

-- Grant audit log access to admin only
GRANT SELECT ON audit_log TO gemvoyage_admin;

COMMENT ON TABLE audit_log IS 'System-wide audit log for tracking data changes';
COMMENT ON FUNCTION audit_changes() IS 'Trigger function for logging data changes to audit_log';
