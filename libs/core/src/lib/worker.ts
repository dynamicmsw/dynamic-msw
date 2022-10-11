import { setupWorker as setupWorkerMsw } from 'msw';
import type { SetupWorkerApi, RestHandler } from 'msw';
import type { SetupServerApi, setupServer as setupServerMsw } from 'msw/node';

import type { CreateMockFnReturnType } from './createMock.types';
import { state } from './state';

export const setupWorker = (
  mocks: Array<RestHandler | CreateMockFnReturnType>,
  // allow to pass setupServer as importing setupServer results in a error in browser environments
  setupServer?: typeof setupServerMsw
): SetupServerApi | SetupWorkerApi => {
  const handlers = mocks.flatMap<RestHandler>(
    (mock) => (mock as CreateMockFnReturnType)?.mocks || (mock as RestHandler)
  );
  const setup = setupServer || setupWorkerMsw;

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

export const startWorker = () => {
  isGlobalWorkerDefined();
  const startFn = (global.__mock_worker as SetupWorkerApi).start;
  if (typeof startFn === 'function') {
    startFn();
  } else {
    (global.__mock_worker as SetupServerApi).listen();
  }
};

export const stopWorker = () => {
  isGlobalWorkerDefined();
  const stopFn = (global.__mock_worker as SetupWorkerApi).start;
  if (typeof stopFn === 'function') {
    stopFn();
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
