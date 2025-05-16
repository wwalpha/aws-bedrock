import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@auth': path.resolve(__dirname, 'src/auth'),
      '@store': path.resolve(__dirname, 'src/stores'),
    },
  },
});
