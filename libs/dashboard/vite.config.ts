import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
    tsconfigPaths({
      root: path.resolve(__dirname, '../../'),
    }),
    viteSingleFile(),
  ],
  build: {
    outDir: path.join(__dirname, '../../dist/libs/dashboard'),
    emptyOutDir: true,
  },
});
