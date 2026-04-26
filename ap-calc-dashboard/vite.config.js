import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Set VITE_BASE_PATH=/your-repo-name/ when building for GitHub Pages
  base: process.env.VITE_BASE_PATH || '/',
})
