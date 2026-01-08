import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/testos/",
  define: {
    __firebase_config: JSON.stringify(process.env.VITE_FIREBASE_CONFIG || '{}'),
    __app_id: JSON.stringify(process.env.VITE_APP_ID || 'p2p-chat-v1'),
    __initial_auth_token: JSON.stringify(process.env.VITE_INITIAL_AUTH_TOKEN || ''),
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
