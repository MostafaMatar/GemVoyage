# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within GemVoyage, please send an email to security@gemvoyage.com. All security vulnerabilities will be promptly addressed.

## Security Measures

### Data Protection
1. **User Data**
   - All user data is stored encrypted at rest
   - Personal data is validated and sanitized
   - Emails are stored in their canonical form
   - Names are validated against strict patterns

2. **Rate Limiting**
   - 5 attempts per minute per IP
   - Automated cleanup of rate limiting data
   - IP addresses are stored securely
   - Failed attempts are monitored

### Database Security
1. **Schema Security**
   - UUID primary keys
   - Input validation constraints
   - Regular expression patterns
   - Row Level Security (RLS)
   - Prepared statements only

2. **Access Control**
   - Minimal privilege principle
   - Row-level policies
   - No direct table access
   - Authenticated operations only

### Application Security
1. **Input Validation**
   - Client-side validation
   - Server-side validation
   - SQL injection prevention
   - XSS prevention
   - CSRF protection

2. **Environmental Security**
   - Environment variables
   - .env file protection
   - Production/development separation
   - Secure configuration

## Security Auditing

### Regular Checks
1. Database audit:
   ```sql
   -- Check RLS policies
   SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
   FROM pg_policies;

   -- Check table permissions
   SELECT grantee, privilege_type 
   FROM information_schema.role_table_grants 
   WHERE table_name = 'waitlist_users';

   -- Verify constraints
   SELECT conname, contype, consrc 
   FROM pg_constraint 
   WHERE conrelid = 'waitlist_users'::regclass;
   ```

2. Rate limit monitoring:
   ```sql
   -- Check rate limit violations
   SELECT ip_address, count(*) as attempts 
   FROM rate_limits 
   WHERE last_attempt > now() - interval '1 hour'
   GROUP BY ip_address 
   HAVING count(*) > 10;
   ```

### Weekly Tasks
1. Review failed login attempts
2. Check rate limit logs
3. Audit database access
4. Review error logs
5. Update security patches

### Monthly Tasks
1. Full security audit
2. Update dependencies
3. Review access policies
4. Check for vulnerabilities
5. Update security documentation

## Incident Response

1. **Detection**
   - Monitor logs
   - Track unusual activity
   - Alert system monitoring

2. **Response**
   - Immediate containment
   - Investigation
   - Document the incident
   - Implement fixes

3. **Recovery**
   - Restore affected systems
   - Verify data integrity
   - Update security measures
   - User notification if required

4. **Prevention**
   - Update security measures
   - Additional monitoring
   - Team training
   - Documentation updates

## Compliance

- GDPR compliance for EU users
- Data minimization principle
- Right to be forgotten support
- Transparent data handling
