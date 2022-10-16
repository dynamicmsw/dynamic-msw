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
};

export const decorators = [
  (Story: ComponentType) => (
    <App>
      <Story />
    </App>
  ),
];

// OOPS: forgot to release
