import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {sourcemap: true},
  base: "/react_74_AnastasiiaLuhovska/"
})
