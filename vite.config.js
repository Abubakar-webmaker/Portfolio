import { defineConfig } from 'vite'

export default defineConfig({
  build: { sourcemap: false },
  optimizeDeps: {
    exclude: ['assets/js/lucide.min.js', 'assets/js/lenis.min.js']
  }
})
