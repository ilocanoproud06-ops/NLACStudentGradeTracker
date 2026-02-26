import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        student: path.resolve(__dirname, 'student.html'),
        admin: path.resolve(__dirname, 'admin.html')
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

