# Deployment Guide

## Build Configuration

### Local Development Setup
1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Vercel Deployment Checklist

### 1. Environment Variables Setup
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` in Vercel dashboard
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel dashboard
- [ ] Set `DEBUG_ACCESS_TOKEN` for production debugging
- [ ] Configure `NODE_ENV=production`
- [ ] Set `INCLUDE_DEBUG=false` (default for production)

### 2. Build Configuration
- [ ] Verify package.json is present
- [ ] Confirm vite.config.js settings
- [ ] Check build output directory is 'dist'
- [ ] Test build locally with `npm run build`

### 3. Deploy Process
1. Push code to repository
2. Go to Vercel dashboard
3. Import project (if not already done)
4. Add environment variables
5. Deploy project
6. Verify deployment logs for any errors

### 4. Post-Deployment Verification
- [ ] Check browser console for environment logs
- [ ] Test form submission
- [ ] Verify Supabase connection
- [ ] Check rate limiting functionality
- [ ] Test error handling

### 5. Debug Tools

#### Development Environment
The project includes debugging tools at `/debug/env-check.html`.

To use in development:
1. Start development server: `npm run dev`
2. Access `/debug/env-check.html`
3. Review environment status
4. Check configuration health

#### Production Environment
Debug tools in production require additional security:

1. Enable debug access:
```bash
# In Vercel dashboard:
DEBUG_ACCESS_TOKEN=your-secure-token
INCLUDE_DEBUG=true
```

2. Access debug endpoint with token:
```bash
curl -H "X-Debug-Token: your-secure-token" https://your-site.com/debug/env-check.html
```

3. Security Considerations:
- Use strong, random tokens
- Enable temporarily only
- Rotate tokens regularly
- Monitor access logs
- Disable when not needed

### 6. Troubleshooting Steps

#### Environment Variables
1. Verify variable names:
   ```bash
   # Local Development
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY

   # Production (Vercel)
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

2. Check configuration:
   ```bash
   # Run environment check
   npm run check-env

   # View detailed status
   npm run test:env
   ```

3. Debug Process:
   - Check browser console logs
   - Review environment health status
   - Verify build configuration
   - Test with debug endpoint

#### Common Issues
1. Wrong variable prefix
   - Local: VITE_*
   - Vercel: NEXT_PUBLIC_*

2. Missing rebuild after changes
   - Redeploy after adding variables
   - Clear build cache if needed

3. Access Issues
   - Verify debug token if enabled
   - Check IP restrictions
   - Review CSP headers

### 7. Security Configuration

#### Basic Security
- [ ] Verify CORS settings in Supabase
- [ ] Check RLS policies are active
- [ ] Test rate limiting
- [ ] Validate input handling
- [ ] Review error messages

#### Debug Security
- [ ] Set secure DEBUG_ACCESS_TOKEN
- [ ] Limit debug tool access
- [ ] Enable logging for debug endpoints
- [ ] Regular token rotation
- [ ] Monitor debug access

#### Headers and CSP
- [ ] Verify CSP configuration
- [ ] Check security headers
- [ ] Test CORS settings
- [ ] Review frame options

### 8. Monitoring Setup
- [ ] Configure error tracking
- [ ] Set up performance monitoring
- [ ] Enable security alerts
- [ ] Monitor rate limits
- [ ] Track debug access

## Environment Configuration

### Development
```bash
# .env file
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
NODE_ENV=development
```

### Production
```bash
# Vercel Environment Variables
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
DEBUG_ACCESS_TOKEN=secure-random-token
NODE_ENV=production
INCLUDE_DEBUG=false
```

### Build Process
1. Variables are processed by inject-env plugin
2. Debug tools are conditionally included
3. Security headers are applied
4. Environment is validated

### Verification Steps
1. Check environment health
2. Verify security settings
3. Test debug access
4. Monitor error logs

## Security Best Practices
1. Never commit sensitive data
2. Rotate access tokens regularly
3. Limit debug tool access
4. Monitor security logs
5. Regular security audits
6. Update dependencies
7. Review CSP configuration
