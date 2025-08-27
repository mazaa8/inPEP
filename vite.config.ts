import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,       // Enforces port 5174
    strictPort: true,  // Prevents automatic fallback
    host: true,        // Enables network access
    open: true         // Automatically open browser
  },
})
