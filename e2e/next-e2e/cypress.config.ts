import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: nxE2EPreset(__dirname),
  // TODO: test this
  videoUploadOnPasses: process.env.CI === 'true',
});
