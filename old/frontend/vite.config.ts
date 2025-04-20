import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: { alias: { './runtimeConfig': './runtimeConfig.browser' } },
  build:{
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom','react-color','react-highlight-within-textarea','react-icons'],
          amplify:['aws-amplify','@aws-amplify/ui-react']
        }
      }
    }
  },
  plugins: [
    react(),
    svgr(),
    nodePolyfills({
      globals: {
        Buffer: true,
        process: true,
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      injectRegister: 'auto',
      manifest: {
        name: 'Generative AI Use Cases JP',
        short_name: 'GenU',
        description:
          'Generative AI を活用したビジネスユースケースのアプリケーション実装',
        start_url: '/',
        display: 'minimal-ui',
        theme_color: '#232F3E',
        background_color: '#FFFFFF',
        icons: [
          {
            src: '/images/aws_icon_192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/images/aws_icon_192_maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/images/aws_icon_512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/images/aws_icon_512_maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
});
