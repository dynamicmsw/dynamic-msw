import { setupWorker } from 'msw';
import type { RestHandler, SetupWorkerApi } from 'msw';
import type { SetupServerApi, setupServer as setupServerMsw } from 'msw/node';

import type { CreateMockFnReturnType } from './createMock.types';
import type { StateConfig } from './state';
import { state } from './state';

interface GetDynamicMocksArg {
  mocks: Array<CreateMockFnReturnType>;
  scenarios?: {
    mocks: Array<RestHandler>;
  }[];
  config?: StateConfig;
}

export const getActiveScenarioHandlers = (
  scenarios: GetDynamicMocksArg['scenarios']
): RestHandler[] => {
  const activeScenarioIndex = state
    .getState()
    .scenarios?.findIndex(({ isActive }) => isActive);
  return scenarios?.[activeScenarioIndex]?.mocks || [];
};

export const getDynamicMockHandlers = (
  mocks: GetDynamicMocksArg['mocks']
): RestHandler[] => mocks.flatMap<RestHandler>((mock) => mock.mocks);

export const getDynamicMocks = ({
  mocks,
  scenarios,
  config,
}: GetDynamicMocksArg): RestHandler[] => {
  if (config) {
    state.setConfig(config);
  }
  const dynamicMocksHandlers = getDynamicMockHandlers(mocks);
  const activeScenarioHandlers = getActiveScenarioHandlers(scenarios);
  return [...activeScenarioHandlers, ...dynamicMocksHandlers];
};

export const resetDynamicMocks = () => {
  state.resetMocks();
};

export const setGlobalWorker = (worker: SetupServerApi | SetupWorkerApi) => {
  global.__mock_worker = worker;
};

// Convenience helpers

interface SetupServerArgs {
  setupServer: typeof setupServerMsw;
  startFnArg?: Parameters<SetupServerApi['listen']>[0];
}

interface SetupWorkerArgs {
  setupServer?: undefined;
  startFnArg?: Parameters<SetupWorkerApi['start']>[0];
}

type SetupWorkerArg = GetDynamicMocksArg &
  (SetupServerArgs | SetupWorkerArgs) & {
    nonDynamicMocks?: RestHandler[];
  };

export const initializeWorker = ({
  mocks,
  scenarios,
  nonDynamicMocks,
  setupServer,
  startFnArg,
  config,
}: SetupWorkerArg): SetupServerApi | SetupWorkerApi => {
  const dynamicMocks = getDynamicMocks({ mocks, scenarios, config });
  const setup = setupServer || setupWorker;
  global.__mock_worker = setup(...(nonDynamicMocks || []), ...dynamicMocks);
  startWorker(startFnArg);
  return global.__mock_worker;
};

const isGlobalWorkerDefined = () => {
  if (!global.__mock_worker) {
    throw Error('You forgot to initilize the worker.');
  }
};

export const startWorker = (
  options: SetupServerArgs['startFnArg'] | SetupWorkerArgs['startFnArg']
) => {
  isGlobalWorkerDefined();
  const startFn = (global.__mock_worker as SetupWorkerApi).start;
  if (typeof startFn === 'function') {
    startFn(options);
  } else {
    (global.__mock_worker as SetupServerApi).listen(options);
  }
};

export const stopWorker = () => {
  isGlobalWorkerDefined();
  const stopFn = (global.__mock_worker as SetupWorkerApi).stop;
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
