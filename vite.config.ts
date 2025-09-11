import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/react-artic-by-kashish/',   // 👈 IMPORTANT: repo name here
})