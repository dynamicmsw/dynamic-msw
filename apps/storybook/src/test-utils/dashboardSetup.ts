import { setupDashboard } from '@dynamic-msw/browser';
import { createFeatureFlagsMock } from './createFeatureFlagsMock';
import { createProductMocks } from './createProductMocks';
import { createSimpleProductScenarioV1 } from './createSimpleProductScenarioV1';
import { createTodoMocks } from './createTodoMocks';
import { setupWorker } from 'msw/browser';

const dashboard = setupDashboard(
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

const worker = setupWorker(...dashboard.handlers);

await worker.start({
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    url: `${
      import.meta.env.VITE_STORYBOOK_PUBLIC_PATH || '/'
    }mockServiceWorker.js`,
  },
});
