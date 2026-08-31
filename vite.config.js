import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Menggunakan relative path agar asset CSS/JS terbaca dengan benar di GitHub Pages (/pencari-cafe/)
  server: {
    port: 3000,
    open: true
  }
})
