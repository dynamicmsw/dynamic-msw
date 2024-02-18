/// <reference types='vitest' />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import fs from 'fs';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

process.env.VITE_DASHBOARD_HTML = getDashboardHTML();

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/dashboard-button',
  plugins: [
    nxViteTsPaths(),
    dts({
      entryRoot: 'src',
      tsConfigFilePath: path.join(__dirname, 'tsconfig.lib.json'),
      skipDiagnostics: true,
    }),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    outDir: '../../dist/dashboard-button',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: 'dashboard-button',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: [/node_modules/],
    },
  },
});

function getDashboardHTML(): string {
  try {
    return fs.readFileSync(
      path.join(__dirname, '../../dist/dashboard/index.html'),
      'utf-8'
    );
  } catch {
    return '<div>Fallback: Dashboard build output is missing</div>';
  }
}
