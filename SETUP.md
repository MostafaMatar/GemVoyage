# GemVoyage Setup Guide

## Quick Start

1. Database Setup
```sql
-- Run schema.sql in your Supabase project
```

2. Environment Configuration
```bash
# Copy example configuration
cp .env.example .env

# Add your Supabase credentials
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. Install & Run
```bash
npm install
npm run dev
```

## Vercel Deployment

1. Add Environment Variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

2. Deploy:
```bash
# The project will auto-deploy when pushing to the main branch
```

## Database Structure

The application uses a single table:

```sql
CREATE TABLE waitlist_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    signed_up_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Features:
- UUID primary keys
- Email uniqueness enforcement
- Automatic timestamps
- Input validation
- Row Level Security

## Security Features

1. Database:
- Input validation
- SQL injection prevention
- Row Level Security
- Secure defaults

2. Application:
- XSS prevention
- Input sanitization
- Error handling
- CSP headers

## Monitoring

1. Debug Endpoint:
- Access `/debug/env-check.html` in development
- Verifies environment setup
- Tests database connection
- Validates configuration

2. Analytics:
- Google Analytics integration (optional)
- Form submission tracking
- Error tracking
- User interaction monitoring

## Environment Variables

### Development
```bash
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
```

### Production (Vercel)
```bash
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

## Maintenance

1. Regular Tasks:
- Monitor form submissions
- Check error logs
- Update dependencies
- Review security settings

2. Troubleshooting:
- Check environment variables
- Verify database connection
- Review browser console
- Use debug endpoint

## Support

For issues:
1. Check browser console
2. Verify environment variables
3. Test database connection
4. Review error messages
5. Check debug endpoint

## Development

1. Local Setup:
```bash
npm install
npm run dev
```

2. Build:
```bash
npm run build
```

3. Preview:
```bash
npm run preview
