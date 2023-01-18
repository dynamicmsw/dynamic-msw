import type { SetupWorkerApi as OriginalSetupWorkerApi } from 'msw';
import { setupWorker as originalSetupWorker } from 'msw';

import type { SetupHandlers, SetupReturnType } from './setup';
import { setupDynamicServer } from './setup';

export const setupWorker = (...handlers: SetupHandlers) =>
  setupDynamicServer(originalSetupWorker, handlers);

export type SetupWorkerApi = SetupReturnType<OriginalSetupWorkerApi>;
