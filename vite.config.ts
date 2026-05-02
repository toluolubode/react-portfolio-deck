import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Resolves figma:asset/<hash>.png imports to src/assets/<hash>.png
function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(source: string) {
      if (source.startsWith('figma:asset/')) {
        const filename = source.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
      return null
    },
  }
}

function terminalSplash() {
  return {
    name: 'terminal-splash',
    configureServer() {
      console.log('\x1b[35m%s\x1b[0m', '\n  ✦ PORTFOLIO DECK ENGINE ✦');
      console.log('\x1b[36m%s\x1b[0m', '  ━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\x1b[90m%s\x1b[0m', '  → Slide registry: src/app/pages/presentation/deck-builder.ts');
      console.log('\x1b[90m%s\x1b[0m', '  → Talk track:     src/app/pages/presentation/presenter-notes.ts');
      console.log('\x1b[32m%s\x1b[0m', '  Ready to build your story.\n');
    }
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    terminalSplash(),
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
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['motion'],
          'vendor-router': ['react-router'],
        },
      },
    },
  },
})
