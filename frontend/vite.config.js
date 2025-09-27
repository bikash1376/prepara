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
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to Clerk CDN:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from Clerk CDN:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  }
})
