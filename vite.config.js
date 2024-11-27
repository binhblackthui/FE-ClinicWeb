import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias:{
      '@': path.resolve(__dirname, "src"),
      '@components': path.resolve(__dirname, "src/components"),
      '@assets': path.resolve(__dirname,"src/assets"),
      '@service': path.resolve(__dirname, "src/service")
    }
  },
  server: {
    proxy: {
        '/api': 'http://localhost:8080', // Backend chạy ở cổng 8080
    },
  },
})
