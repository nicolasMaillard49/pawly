import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import type { Plugin } from 'vite'

// Plugin to replace Nuxt's import.meta.client/server with boolean values
function nuxtImportMetaPlugin(): Plugin {
  return {
    name: 'nuxt-import-meta',
    enforce: 'pre',
    transform(code, _id) {
      if (code.includes('import.meta.client') || code.includes('import.meta.server')) {
        return {
          code: code
            .replace(/import\.meta\.client/g, 'true')
            .replace(/import\.meta\.server/g, 'false'),
          map: null,
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [nuxtImportMetaPlugin(), vue()],
  esbuild: {
    tsconfigRaw: '{}',
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['**/*.spec.ts', '**/*.test.ts'],
  },
  resolve: {
    alias: {
      '#imports': './tests/mocks/imports.ts',
      '#app': './tests/mocks/app.ts',
    },
  },
})
