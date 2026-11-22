import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The demo page is for looking at the kit while building it. It is not published (package "files" is src only).
export default defineConfig({
  root: 'demo',
  plugins: [react(), tailwindcss()],
  server: { port: 5199, strictPort: true },
})
