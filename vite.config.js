import { defineConfig } from 'vite'
import injectEnvPlugin from './plugins/inject-env.js'
import protectDebugPlugin from './plugins/protect-debug.js'

export default defineConfig({
  // Base public path when served
  base: '/',
  
  // Environment variable configuration
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  define: {
    // Make environment variables available at build time
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate sourcemaps for better debugging
    sourcemap: true,
    // Minify output
    minify: 'terser',
    // Configure rollup options
    rollupOptions: {
      input: {
        main: 'index.html',
        privacy: 'privacy-policy.html',
        terms: 'terms-of-use.html'
      }
    }
  },

  // Development server configuration
  server: {
    port: 3000,
    strictPort: true,
    host: true
  },

  // Preview configuration
  preview: {
    port: 8080,
    strictPort: true
  },

  // Environment variable handling
  experimental: {
    renderBuiltUrl(filename, { hostType, type, hostId }) {
      // Handle CDN URLs and environment-specific configurations
      return { relative: true }
    }
  },

  // Optimization
  optimizeDeps: {
    include: ['@supabase/supabase-js']
  },

  // Plugins configuration
  plugins: [
    // Inject environment variables into HTML
    injectEnvPlugin(),
    // Protect debug endpoints in production
    protectDebugPlugin(),
    
    // Security headers for development
    {
      name: 'security-headers',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          res.setHeader('X-Content-Type-Options', 'nosniff')
          res.setHeader('X-Frame-Options', 'DENY')
          res.setHeader('X-XSS-Protection', '1; mode=block')
          next()
        })
      }
    },

    // Additional build-time validation
    {
      name: 'validate-env',
      buildStart() {
        const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];
        const missing = requiredVars.filter(name => !process.env[name]);
        
        if (missing.length > 0) {
          console.warn('Warning: Missing environment variables:', missing.join(', '));
          console.warn('Checking alternative variable names...');
        }
      }
    }
  ]
})
