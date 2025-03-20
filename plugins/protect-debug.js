// Plugin to protect debug endpoints in production
export default function protectDebugPlugin() {
    return {
        name: 'protect-debug',
        configureServer(server) {
            server.middlewares.use('/debug', (req, res, next) => {
                if (process.env.NODE_ENV === 'production') {
                    // In production, only allow access with debug token
                    const debugToken = req.headers['x-debug-token'];
                    if (debugToken !== process.env.DEBUG_ACCESS_TOKEN) {
                        res.statusCode = 404;
                        res.end('Not Found');
                        return;
                    }
                }
                next();
            });
        },
        generateBundle(options, bundle) {
            // Remove debug files from production build
            if (process.env.NODE_ENV === 'production' && !process.env.INCLUDE_DEBUG) {
                Object.keys(bundle).forEach(fileName => {
                    if (fileName.startsWith('debug/')) {
                        delete bundle[fileName];
                    }
                });
            }
        }
    };
}
