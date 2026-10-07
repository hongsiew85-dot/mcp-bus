import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function apiMiddlewarePlugin(): Plugin {
  return {
    name: 'api-middleware-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        try {
          const parsedUrl = new URL(req.url, 'http://localhost:3000');
          const pathname = parsedUrl.pathname;

          if (pathname === '/api/health' || pathname === '/api/health.js') {
            const { default: handler } = await import('./api/health.js');
            return await handler(req, res);
          }

          if (
            pathname === '/api/bus-arrival' ||
            pathname === '/api/bus-arrival.js' ||
            pathname === '/api/busArrival' ||
            pathname === '/api/busArrival.js'
          ) {
            const { default: handler } = await import('./api/bus-arrival.js');
            return await handler(req, res);
          }

          next();
        } catch (error) {
          console.error('API middleware error:', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Internal API Server Error', details: String(error) }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiMiddlewarePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
