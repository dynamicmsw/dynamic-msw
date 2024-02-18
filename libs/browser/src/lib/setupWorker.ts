import { AllHandlerTypes } from '@dynamic-msw/core';
import SetupWorkerApi from './SetupWorkerApi';

export default function setupWorker(...handlers: AllHandlerTypes[]) {
  return new SetupWorkerApi(handlers, false);
}
