```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // เปลี่ยนเป็นชื่อ GitHub Repository ของคุณ
  base: '/teangteed/',

  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
```
