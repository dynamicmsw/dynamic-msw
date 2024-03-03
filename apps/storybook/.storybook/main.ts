import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: 'apps/storybook/vite.config.ts',
      },
    },
  },
  managerHead: (head) => {
    if (!process.env.VITE_STORYBOOK_PUBLIC_PATH) return head;
    return `${head}<base href="${process.env.VITE_STORYBOOK_PUBLIC_PATH}">`;
  },
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      build: {
        target: 'esnext',
      },
    }),
};

export default config;

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/recipes/storybook/custom-builder-configs
