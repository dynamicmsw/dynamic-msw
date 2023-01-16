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
    config.define = {
      'process.env': Object.keys(process.env).reduce(
        (prev, key) =>
          key.startsWith('STORYBOOK_')
            ? { ...prev, [key]: process.env[key] }
            : prev,
        {}
      ),
    };

    config.base = process.env.STORYBOOK_PUBLIC_PATH || '/';

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
  managerHead: (head) => {
    const sharedHead = `
      ${head}
      <style>
        [id^="hidden"]{display: none !important}
      </style>
    `;
    if (process.env.STORYBOOK_PUBLIC_PATH) {
      return `
        ${sharedHead}
        <base href="${process.env.STORYBOOK_PUBLIC_PATH}">
      `;
    } else {
      return sharedHead;
    }
  },
  previewHead: (head) => {
    const sharedHead = `
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <script>
        window.global = window;
      </script>
    `;
    return `
        ${head}
        ${
          process.env.STORYBOOK_PUBLIC_PATH
            ? `<base href="${process.env.STORYBOOK_PUBLIC_PATH}"/>`
            : ''
        }
        ${sharedHead}
      `;
  },
};
