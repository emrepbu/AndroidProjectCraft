import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/AndroidProjectCraft/',
  server: {
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  }
})
