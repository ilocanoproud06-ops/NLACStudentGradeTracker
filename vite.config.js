import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Keep all code in single chunks per entry to avoid cross-loading issues
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      },
      input: {
        main: path.resolve(__dirname, 'index.html'),
        student: path.resolve(__dirname, 'student.html'),
        admin: path.resolve(__dirname, 'admin.html'),
        'student-access': path.resolve(__dirname, 'student-access.html')
      }
    }
  },
  server: {
    port: 5173,
    host: true
  },
  // Ensure proper resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})

