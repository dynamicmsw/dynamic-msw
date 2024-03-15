import {
  setup,
  type AllPublicHandlerTypes,
  createStore,
  type AllHandlerTypes,
} from '@dynamic-msw/core';
import { type DashboardConfig } from './DashboardConfig';
import { injectDashboardButton } from '@dynamic-msw/dashboard-button';
export default function setupDashboard(
  handlers: AllPublicHandlerTypes[],
  config?: DashboardConfig,
) {
  const configWithDefaults = { renderDashboardButton: true, ...config };
  if (configWithDefaults?.renderDashboardButton) {
    injectDashboardButton(configWithDefaults?.dashboardButtonWrapper);
  }

  const bc = new BroadcastChannel('dynamic-msw');
  bc.addEventListener('message', (e) => {
    if (e.data === 'reload') {
      window.location.reload();
    }
  });

  return setup(handlers as AllHandlerTypes[], createStore(true), true);
}
