import { nxE2EStorybookPreset } from '@nrwl/storybook/presets/cypress';
import { defineConfig } from 'cypress';

console.log(process.env.CI === 'true', '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');

export default defineConfig({
  e2e: { ...nxE2EStorybookPreset(__dirname), retries: 1 },
  videoUploadOnPasses: process.env.CI === 'true',
});
