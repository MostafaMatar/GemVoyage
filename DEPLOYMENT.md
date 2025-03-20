# Deployment Guide

## Vercel Deployment Checklist

### 1. Environment Variables Setup
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` in Vercel dashboard
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel dashboard
- [ ] Verify variable names match exactly (including NEXT_PUBLIC_ prefix)
- [ ] Ensure values are copied correctly from Supabase dashboard

### 2. Deploy Process
1. Push code to repository
2. Go to Vercel dashboard
3. Import project (if not already done)
4. Add environment variables
5. Deploy project
6. Verify deployment logs for any errors

### 3. Post-Deployment Verification
- [ ] Check browser console for environment logs
- [ ] Test form submission
- [ ] Verify Supabase connection
- [ ] Check rate limiting functionality
- [ ] Test error handling

### 4. Debug Tool
The project includes a debug endpoint at `/debug/env-check.html` for verifying environment variables.

**Important Security Note:**
- Only use this tool during development and testing
- Remove or restrict access to debug directory in production
- Add to robots.txt to prevent indexing
- Consider adding authentication for debug tools

To use the debug tool:
1. Access `/debug/env-check.html` in your browser
2. Review environment variable status
3. Check Supabase connection
4. Verify correct variable naming

### 5. Troubleshooting Steps

#### If variables aren't being read:
1. Verify variable names:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

2. Check browser console:
   - Look for environment check logs
   - Check for any error messages

3. Rebuild deployment:
   ```bash
   # In Vercel dashboard
   1. Go to Deployments
   2. Select latest deployment
   3. Click "Redeploy"
   ```

4. Clear browser cache and hard reload

#### Common Issues:
1. Wrong variable prefix
   - Local: VITE_*
   - Vercel: NEXT_PUBLIC_*

2. Missing rebuild after adding variables
   - Always redeploy after adding environment variables

3. Cache issues
   - Clear browser cache
   - Use incognito mode for testing

4. Connection errors
   - Verify Supabase project is active
   - Check IP restrictions in Supabase

### 5. Security Checks
- [ ] Verify CORS settings in Supabase
- [ ] Check RLS policies are active
- [ ] Confirm rate limiting is working
- [ ] Test input validation
- [ ] Verify error messages are safe

### 7. Security Considerations
- [ ] Remove or secure debug endpoints in production
- [ ] Add IP restrictions to Supabase
- [ ] Enable request logging
- [ ] Set up error alerting
- [ ] Configure security headers

### 8. Monitoring Setup
- [ ] Set up error monitoring
- [ ] Configure performance monitoring
- [ ] Enable deployment notifications
- [ ] Set up status alerts

## Local Development
For local development, use `.env` file with VITE_ prefix:
```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Production Deployment
For Vercel, use NEXT_PUBLIC_ prefix in dashboard:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
