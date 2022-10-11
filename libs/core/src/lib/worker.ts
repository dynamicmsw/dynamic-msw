import type { SetupWorkerApi, RestHandler } from 'msw';
import type { SetupServerApi } from 'msw/node';

import { isClient as defaultIsClient } from '../utils';
import type { CreateMockFnReturnType } from './createMock.types';
import { state } from './state';

export const setupWorker = (
  mocks: Array<RestHandler | CreateMockFnReturnType>,
  isClient: boolean = defaultIsClient
): SetupServerApi | SetupWorkerApi => {
  const handlers = mocks.flatMap<RestHandler>(
    (mock) => (mock as CreateMockFnReturnType)?.mocks || (mock as RestHandler)
  );

  /* eslint-disable @typescript-eslint/no-var-requires */
  const setup = isClient
    ? require('msw').setupWorker
    : require('msw/node').setupServer;
  /* eslint-enable @typescript-eslint/no-var-requires */

  global.__mock_worker = setup(...handlers);
  startWorker();
  state.initializeCreateMocksFromStorage();
  return global.__mock_worker;
};

const isGlobalWorkerDefined = () => {
  if (!global.__mock_worker) {
    throw Error('You forgot to initilize the worker.');
  }
};

export const startWorker = (isClient: boolean = defaultIsClient) => {
  isGlobalWorkerDefined();
  if (isClient) {
    (global.__mock_worker as SetupWorkerApi).start();
  } else {
    (global.__mock_worker as SetupServerApi).listen();
  }
};

export const stopWorker = (isClient: boolean = defaultIsClient) => {
  isGlobalWorkerDefined();
  if (isClient) {
    (global.__mock_worker as SetupWorkerApi).stop();
  } else {
    (global.__mock_worker as SetupServerApi).close();
  }
};

export const resetHandlers = () => {
  isGlobalWorkerDefined();
  const { createMocks } = state.getState();
  Object.keys(createMocks).forEach((key) => {
    createMocks[key].resetMock();
  });
  global.__mock_worker.resetHandlers();
};
