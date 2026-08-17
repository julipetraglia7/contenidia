import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: true },
  // base: './' facilita servir la app sobre GitHub Pages en /app/dist/.
  base: './'
});
