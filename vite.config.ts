import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/three/')) return 'renderer';
          if (id.includes('/node_modules/@dimforge/')) return 'physics';
        },
      },
    },
  },
});
