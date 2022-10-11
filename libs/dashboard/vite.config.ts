import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
    viteSingleFile(),
  ],
  build: {
    outDir: path.join(__dirname, '../../dist/libs/dashboard'),
    emptyOutDir: true,
  },
});
