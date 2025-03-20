// Error boundary for environment configuration
export function initErrorBoundary() {
    window.addEventListener('error', (event) => {
        // Check if error is environment related
        if (event.error && event.error.message.includes('Missing Supabase configuration')) {
            // Clear any existing error messages
            const existingError = document.querySelector('.env-error');
            if (existingError) existingError.remove();

            // Create error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'env-error';
            errorDiv.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background-color: #ff5555;
                color: white;
                padding: 1rem;
                text-align: center;
                z-index: 9999;
                font-family: 'Open Sans', sans-serif;
            `;

            // Add error content
            errorDiv.innerHTML = `
                <p style="margin: 0;">
                    <strong>Configuration Error:</strong> 
                    The application is missing required environment variables. 
                    Please check the configuration or contact support.
                </p>
            `;

            // Add to page
            document.body.prepend(errorDiv);

            // Log detailed error for debugging
            console.error('Environment Error Details:', {
                error: event.error,
                env: {
                    hasUrl: !!window.ENV?.ENV_SUPABASE_URL,
                    hasKey: !!window.ENV?.ENV_SUPABASE_ANON_KEY,
                    mode: import.meta.env.MODE
                }
            });

            // Prevent default error handling
            event.preventDefault();
        }
    });
}

// Export a function to check environment health
export function checkEnvironmentHealth() {
    return {
        isHealthy: !!(window.ENV?.ENV_SUPABASE_URL && window.ENV?.ENV_SUPABASE_ANON_KEY),
        missingVars: {
            url: !window.ENV?.ENV_SUPABASE_URL,
            key: !window.ENV?.ENV_SUPABASE_ANON_KEY
        }
    };
}
