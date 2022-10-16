import { nxE2EStorybookPreset } from '@nrwl/storybook/presets/cypress';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: { ...nxE2EStorybookPreset(__dirname), retries: 1 },
  videoUploadOnPasses: process.env.CI !== 'true',
});
