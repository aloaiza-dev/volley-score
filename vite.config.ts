import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures assets are linked relatively (essential for GH Pages)
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})