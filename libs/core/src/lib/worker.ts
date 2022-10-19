import { setupWorker as setupWorkerMsw } from 'msw';
import type { SetupWorkerApi, RestHandler } from 'msw';
import type { SetupServerApi, setupServer as setupServerMsw } from 'msw/node';

import type { CreateMockFnReturnType } from './createMock.types';
import { state } from './state';

interface SetupWorkerArg {
  mocks: Array<RestHandler | CreateMockFnReturnType>;
  scenarios?: {
    mocks: Array<RestHandler | CreateMockFnReturnType>;
    isActive?: boolean;
  }[];
  // enforce to pass setupServer for node environments
  // importing setupServer results in a error in browser environments
  setupServer?: typeof setupServerMsw;
}
export const setupWorker = ({
  mocks,
  scenarios,
  setupServer,
}: SetupWorkerArg): SetupServerApi | SetupWorkerApi => {
  const handlers = mocks.flatMap<RestHandler>(
    (mock) => (mock as CreateMockFnReturnType)?.mocks || (mock as RestHandler)
  );
  const setup = setupServer || setupWorkerMsw;
  const activeScenarioIndex = scenarios?.findIndex(({ isActive }) => isActive);
  const activeScenarioMocks = scenarios?.[activeScenarioIndex]?.mocks || [];
  global.__mock_worker = setup(...handlers);
  global.__mock_worker.use(...activeScenarioMocks);
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
  state.resetMocks();
  global.__mock_worker?.resetHandlers();
};
