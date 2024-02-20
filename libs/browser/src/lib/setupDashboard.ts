import { AllHandlerTypes } from '@dynamic-msw/core';
import SetupWorkerApi from './SetupWorkerApi';

export default function setupDashboard(...handlers: AllHandlerTypes[]) {
  return new SetupWorkerApi(true, handlers);
}
