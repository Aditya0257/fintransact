import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Bind to all network interfaces
    port: 5173,      // Explicitly set the port, though it's 5173 by default
    watch: {
      usePolling: true, // Useful in Docker containers for better file watching
    },
  },
})
