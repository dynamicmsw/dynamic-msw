import { setupWorker as originalSetupWorker } from 'msw';

import type { SetupHandlers } from './setup';
import { setupDynamicServer } from './setup';

export const setupWorker = (...handlers: SetupHandlers) =>
  setupDynamicServer(originalSetupWorker, handlers);
