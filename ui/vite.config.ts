import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',          // Required: FiveM NUI resolves from nui://resource/ not /
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
