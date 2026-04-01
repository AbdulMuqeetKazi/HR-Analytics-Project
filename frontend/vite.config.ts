import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    // Increase chunk size warning limit to 600 kB
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Manual code splitting to reduce chunk sizes
        manualChunks: {
          // Routing
          'vendor-router': ['react-router-dom'],
          // Firebase (large SDK)
          'vendor-firebase': ['firebase/app', 'firebase/auth'],
          // Charts library
          'vendor-recharts': ['recharts'],
          // UI animation
          'vendor-motion': ['motion'],
          // Radix UI primitives
          'vendor-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-popover',
          ],
        },
      },
    },
  },
})
