import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png', 'firebase-messaging-sw.js'], // firebase-messaging-sw.js 파일을 포함
      workbox: {
        // 모든 경로에 대한 precache에서 제외
        globPatterns: ['**/*.{js,css,html,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname === '/firebase-messaging-sw.js',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'firebase-messaging-sw',
            },
          },
        ],
      },
    }),
  ],
  base: '/',
});
