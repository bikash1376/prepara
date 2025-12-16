import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  server: {
    proxy: {
      // Proxy Clerk CDN requests to avoid CORS issues
      '/npm/@clerk': {
        target: 'https://clerk.accounts.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/npm\/@clerk/, '/npm/@clerk'),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
// proxy error suppressed
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
// Sending Request to Clerk CDN suppressed
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
// Received Response from Clerk CDN suppressed
          });
        },
      }
    }
  }
})
