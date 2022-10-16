import { nxE2EStorybookPreset } from '@nrwl/storybook/presets/cypress';
import { defineConfig } from 'cypress';

throw Error(
  'check process.env.CI var: ' + (process.env.CI === 'true').toString()
);
export default defineConfig({
  e2e: { ...nxE2EStorybookPreset(__dirname), retries: 1 },
  // TODO: test this
  videoUploadOnPasses: process.env.CI === 'true',
});
