import { AllPublicHandlerTypes } from '@dynamic-msw/core';
import SetupWorkerApi from './SetupWorkerApi';
import { DashboardConfig } from '../types/DashboardConfig';
import { injectDashboardButton } from '@dynamic-msw/dashboard-button';

export default function setupDashboard(
  handlers: AllPublicHandlerTypes[],
  config?: DashboardConfig
) {
  const worker = new SetupWorkerApi(handlers, true);
  if (config?.renderDashboardButton) {
    injectDashboardButton(config?.dashboardButtonWrapper);
  }
  return worker;
}
