import { setupServer } from 'msw/node';
import type { SetupServerApi } from 'msw/node';

import type { SharedStartConfig } from './start.types';

export const startServer = ({
  mocks,
  nonDynamicMocks,
  setupFnArg,
  config,
}: SharedStartConfig & {
  setupFnArg?: Parameters<SetupServerApi['listen']>[0];
}): SetupServerApi => {
  const server = setupServer();
  return server;
};
