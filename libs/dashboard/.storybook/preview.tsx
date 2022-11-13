import type { ComponentType } from 'react';

import { App } from '../src/App';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: ['Dashboard', ['Primary']],
    },
  },
};

export const decorators = [
  (Story: ComponentType) => (
    <App>
      <Story />
    </App>
  ),
];
