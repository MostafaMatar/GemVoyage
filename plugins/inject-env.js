// Vite plugin to inject environment variables into HTML
export default function injectEnvPlugin() {
  return {
    name: 'inject-env',
    transformIndexHtml(html) {
      // Get environment variables
      const envVars = {
        VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      };

      // Create a safe version of environment variables (no sensitive data)
      const safeEnvVars = {
        ENV_SUPABASE_URL: envVars.VITE_SUPABASE_URL,
        ENV_SUPABASE_ANON_KEY: envVars.VITE_SUPABASE_ANON_KEY
      };

      // Inject environment variables into HTML
      const envScript = `
        <script>
          window.ENV = ${JSON.stringify(safeEnvVars)};
        </script>
      `;

      return html.replace('</head>', `${envScript}</head>`);
    }
  };
}
