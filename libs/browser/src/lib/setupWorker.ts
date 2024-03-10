import { type AllPublicHandlerTypes } from '@dynamic-msw/core';
import SetupWorkerApi from './SetupWorkerApi';

export default function setupWorker(...handlers: AllPublicHandlerTypes[]) {
  return new SetupWorkerApi(handlers, false);
}
