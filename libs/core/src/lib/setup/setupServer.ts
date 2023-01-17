import { setupServer as originalSetupServer } from 'msw/node';

import type { SetupHandlers } from './setup';
import { setupDynamicServer } from './setup';

// TODO: breaking change get dynamic mocks is removed
export const setupServer = (...handlers: SetupHandlers) =>
  setupDynamicServer(originalSetupServer, handlers);
