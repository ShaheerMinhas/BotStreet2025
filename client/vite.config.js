import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", // Ensures correct base path for your app (update if deploying to a subdirectory)
  build: {
    outDir: "dist", // Output directory for the build (default for Vite)
    rollupOptions: {
      output: {
        assetFileNames: "[name].[hash].[ext]", // Ensures unique hashed file names for cache busting
      },
    },
  },
  server: {
    headers: {
      "Content-Type": "application/javascript", // Ensures correct MIME type for JS files
    },
  },
})
