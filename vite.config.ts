
import { defineConfig } from 'vitest/config';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [
    sveltekit({
  paths: {
    base:
      process.env.NODE_ENV === 'production'
        ? ((process.env.BVI_BASE_PATH ?? '/biblia-visual-interactiva') as `/${string}`)
        : ''
  },

  compilerOptions: {
        // Activar runes de Svelte 5 en nuestro proyecto
        runes: ({ filename }) =>
          filename.includes('node_modules') ? undefined : true
      },

      adapter: adapter({
        pages: 'build',
        assets: 'build',
        fallback: '404.html'
      })
    })
  ],

  test: {
    expect: { requireAssertions: true },
    projects: [
      {
        extends: './vite.config.ts',
        test: {
          name: 'server',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
          exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
        }
      }
    ]
  }
});
