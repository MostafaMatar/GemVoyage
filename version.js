// Application version and environment information
export const VERSION = {
    version: '1.0.0',
    buildDate: new Date().toISOString(),
    environment: import.meta.env.MODE,
    config: {
        features: {
            rateLimit: true,
            analytics: true,
            debugTools: import.meta.env.DEV,
            environmentCheck: true
        },
        security: {
            cspEnabled: true,
            rls: true,
            inputValidation: true,
            rateLimit: true
        }
    }
};

// Environment configuration status
export function getEnvironmentStatus() {
    return {
        version: VERSION.version,
        timestamp: new Date().toISOString(),
        environment: import.meta.env.MODE,
        status: {
            hasSupabaseUrl: !!window.ENV?.ENV_SUPABASE_URL,
            hasSupabaseKey: !!window.ENV?.ENV_SUPABASE_ANON_KEY,
            hasAnalytics: typeof gtag === 'function',
            hasErrorBoundary: true
        },
        debug: import.meta.env.DEV,
        features: VERSION.config.features,
        security: VERSION.config.security
    };
}

// Log environment information
export function logEnvironmentInfo() {
    if (import.meta.env.DEV) {
        console.group('Environment Status');
        console.log('Version:', VERSION.version);
        console.log('Build Date:', VERSION.buildDate);
        console.log('Environment:', import.meta.env.MODE);
        console.log('Features:', VERSION.config.features);
        console.log('Security:', VERSION.config.security);
        console.groupEnd();
    }
}

// Check configuration health
export function checkConfigurationHealth() {
    const status = getEnvironmentStatus();
    const issues = [];

    if (!status.status.hasSupabaseUrl) {
        issues.push('Missing Supabase URL');
    }
    if (!status.status.hasSupabaseKey) {
        issues.push('Missing Supabase Key');
    }
    if (!status.status.hasAnalytics && !import.meta.env.DEV) {
        issues.push('Analytics not configured');
    }

    return {
        healthy: issues.length === 0,
        issues,
        timestamp: new Date().toISOString(),
        environment: status.environment
    };
}
