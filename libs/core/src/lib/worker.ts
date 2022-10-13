import { setupWorker as setupWorkerMsw } from 'msw';
import type { SetupWorkerApi, RestHandler } from 'msw';
import type { SetupServerApi, setupServer as setupServerMsw } from 'msw/node';

import type { CreateMockFnReturnType } from './createMock.types';
import { state } from './state';

export const setupWorker = (
  mocks: Array<RestHandler | CreateMockFnReturnType>,
  // enforce to pass setupServer for node environments
  // importing setupServer results in a error in browser environments
  setupServer?: typeof setupServerMsw
): SetupServerApi | SetupWorkerApi => {
  const handlers = mocks.flatMap<RestHandler>(
    (mock) => (mock as CreateMockFnReturnType)?.mocks || (mock as RestHandler)
  );
  const setup = setupServer || setupWorkerMsw;

  global.__mock_worker = setup(...handlers);
  startWorker();
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
    // TODO: make configurable
    startFn({
      onUnhandledRequest: 'bypass',
    });
  } else {
    (global.__mock_worker as SetupServerApi).listen({
      onUnhandledRequest: 'bypass',
    });
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
  const { mocks } = state.getState();
  mocks.forEach(({ resetMock }) => {
    resetMock?.();
  });
  global.__mock_worker.resetHandlers();
};
