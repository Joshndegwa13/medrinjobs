import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico'],
        manifest: {
          name: 'Medrin Jobs',
          short_name: 'Medrin',
          description: 'Find Your Dream Job',
          theme_color: '#0284c7',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: '/logo192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/logo512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    server: {
      port: 5173,
      host: true
    },
    define: {
      'process.env': env
    }
  };
});