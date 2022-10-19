import { setupWorker as setupWorkerMsw } from 'msw';
import type { SetupWorkerApi, RestHandler } from 'msw';
import type { SetupServerApi, setupServer as setupServerMsw } from 'msw/node';

import type { CreateMockFnReturnType } from './createMock.types';
import type { ScenariosState } from './state';
import { state } from './state';

// TODO: pass scenarios as seperate argument so that they will always initiliaze after mocks
// TODO: this will also remove the need to use the spread operator by a developer
// TODO: consider if one should not initialize a createMock and enforce it to be
// TODO: initiliazed when when used in a scenario
interface SetupWorkerArg {
  mocks: Array<RestHandler | CreateMockFnReturnType>;
  scenarios?: ScenariosState[];
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
  const activeScenarioMocks =
    scenarios?.[activeScenarioIndex]?.mocks.flatMap(({ mocks }) => mocks) || [];
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
