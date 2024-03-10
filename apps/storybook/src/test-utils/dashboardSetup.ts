import { setupDashboard } from '@dynamic-msw/browser';
import { createFeatureFlagsMock } from './createFeatureFlagsMock';
import { createProductMocks } from './createProductMocks';
import { createSimpleProductScenarioV1 } from './createSimpleProductScenarioV1';
import { createTodoMocks } from './createTodoMocks';

const setup = setupDashboard(
  [
    createFeatureFlagsMock(),
    createTodoMocks(),
    createProductMocks(),
    createSimpleProductScenarioV1(),
  ],
  {
    renderDashboardButton: true, // true by default
  },
);
await setup.start({
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    url: `${
      import.meta.env.VITE_STORYBOOK_PUBLIC_PATH || '/'
    }mockServiceWorker.js`,
  },
});
