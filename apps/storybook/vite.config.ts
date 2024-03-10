/// <reference types='vitest' />
import { defineConfig } from 'vite';
import * as path from 'path';
import fs from 'fs';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

process.env.VITE_DASHBOARD_HTML = getDashboardHTML();

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/storybook',
  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [react(), nxViteTsPaths()],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: '../../dist/apps/storybook',
    reportCompressedSize: true,
    target: 'esnext',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});

function getDashboardHTML(): string {
  try {
    return fs.readFileSync(
      path.join(__dirname, '../../dist/dashboard/index.html'),
      'utf-8',
    );
  } catch {
    return '<div>Fallback: Dashboard build output is missing</div>';
  }
}
