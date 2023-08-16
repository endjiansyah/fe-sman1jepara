import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import apikey from 'config.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
