const { mergeConfig } = require('vite');
const tsconfigPaths = require('vite-tsconfig-paths').default;
const path = require('path');

module.exports = {
  stories: [],
  addons: ['@storybook/addon-essentials'],
  core: { builder: '@storybook/builder-vite' },
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      plugins: [
        tsconfigPaths({
          root: path.resolve(__dirname, '../'),
        }),
      ],
    });
  },
};
