# GemVoyage

A community-driven platform for discovering hidden travel destinations and sharing authentic experiences.

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gemvoyage.git
cd gemvoyage
```

2. Set up environment variables:
   - Copy `.env.example` to create a new `.env` file:
   ```bash
   cp .env.example .env
   ```
   - Update the `.env` file with your Supabase credentials:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

3. Set up Supabase:
   - Create a new Supabase project
   - Run the database schema from `schema.sql`
   - The schema includes:
     - Secure user data storage with input validation
     - Rate limiting to prevent abuse
     - Row Level Security policies
     - Email format validation
     - Automatic cleanup of rate limit data
     - Performance optimized indexes

## Security Features

### Database Security
- UUID primary keys instead of sequential IDs
- Input validation at database level
- Regular expression constraints on email and name fields
- Row Level Security (RLS) policies
- Rate limiting with IP tracking
- Automated cleanup of rate limit data

### Application Security
- Input sanitization
- Email format validation
- Name format validation with regex
- Rate limiting (5 attempts per minute)
- XSS prevention
- CORS protection
- Environment variable protection
- Error message sanitization

### API Security
- Prepared statements for all queries
- Rate limiting at API level
- IP-based abuse prevention
- Request validation
- Secure error handling

4. Install and Configure:
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run serve
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Preview production build
- `npm run lint` - Check code quality
- `npm run check-env` - Verify environment variables
- `npm run test:env` - Debug environment setup

### Development Tools
- Vite for fast development and optimized builds
- ESLint for code quality
- Environment variable validation
- Debug tools for troubleshooting

## Development

- The site is built with vanilla JavaScript and uses Vite for module bundling
- Styling is done with custom CSS using CSS variables for theming
- Forms submit to Supabase database
- Google Analytics is integrated for tracking

## Environment Variables

### Local Development
Required environment variables in `.env`:
```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Vercel Deployment
1. Go to your Vercel project settings
2. Navigate to the "Environment Variables" section
3. Add the following variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Note: For Vercel deployment, use `NEXT_PUBLIC_` prefix instead of `VITE_` prefix.

Optional variables:
- `GA_TRACKING_ID`: Google Analytics tracking ID

### Troubleshooting
If environment variables aren't being read:
1. Verify variable names match the platform:
   ```bash
   # Check environment variables
   npm run check-env
   
   # View full environment details
   npm run test:env
   ```

2. Verify configurations:
   - Local: Use VITE_SUPABASE_* in .env
   - Vercel: Use NEXT_PUBLIC_SUPABASE_* in dashboard
   - Run `npm run build` locally to test
   - Check console for environment logs

3. Common Solutions:
   - Clear node_modules and reinstall
   - Rebuild the deployment
   - Use debug/env-check.html tool
   - Check vite.config.js settings

## Security

- Environment variables are never committed to the repository
- All sensitive keys should be stored in `.env`
- `.env` is listed in `.gitignore`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
