import { defineConfig, defaultPlugins } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'https://ro-cargo-api.dreambigg.workers.dev/doc',
  output: {
    format: 'prettier',
    lint: 'eslint',
    path: './src/client',
  },
  plugins: [
    ...defaultPlugins,
    { name: '@hey-api/client-fetch', runtimeConfigPath: './client-config.ts' },
    '@tanstack/react-query',
  ],
});
