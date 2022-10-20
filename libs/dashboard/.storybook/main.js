const path = require('path');

const react = require('@vitejs/plugin-react').default;

const rootMain = require('../../../.storybook/main');

module.exports = {
  ...rootMain,
  core: { ...rootMain.core, builder: '@storybook/builder-vite' },
  features: {
    // Disable when running e2e tests to prebuild stories and prevent flaky tests
    storyStoreV7: !process.env.NX_TASK_TARGET_PROJECT?.endsWith('-e2e'),
  },
  stories: [
    ...rootMain.stories,
    '../../**/*.stories.mdx',
    '../../**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [...rootMain.addons, '@nrwl/react/plugins/storybook'],
  viteFinal: async (config, { configType }) => {
    if (rootMain.viteFinal) {
      config = await rootMain.viteFinal(config, { configType });
    }

    config.plugins = config.plugins.filter(
      (plugin) =>
        !(Array.isArray(plugin) && plugin[0]?.name.includes('vite:react'))
    );

    config.plugins.push(
      react({
        exclude: [/\.stories\.(t|j)sx?$/, /node_modules/],
        jsxImportSource: '@emotion/react',
      })
    );
    config.cacheDir = path.join(
      __dirname,
      '../../../node_modules/.cache/.dashboard-vite-storybook'
    );
    return config;
  },
};
