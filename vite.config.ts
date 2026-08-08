import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: set base to '/sdlc-koans/' when deploying to project pages
export default defineConfig({
  plugins: [react()],
  base: '/sdlc-koans/',
})
