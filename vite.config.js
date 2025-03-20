import { defineConfig } from 'vite'

export default defineConfig({
  // Base public path when served
  base: '/',
  
  // Configure environment variables
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  
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

  // Optimization
  optimizeDeps: {
    include: ['@supabase/supabase-js']
  },

  // Security headers (in addition to vercel.json)
  plugins: [
    {
      name: 'security-headers',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Security headers for development
          res.setHeader('X-Content-Type-Options', 'nosniff')
          res.setHeader('X-Frame-Options', 'DENY')
          res.setHeader('X-XSS-Protection', '1; mode=block')
          next()
        })
      }
    }
  ]
})
