import { setupWorker } from 'msw';
import type { RestHandler, SetupWorkerApi } from 'msw';
import type { SetupServerApi, setupServer as setupServerMsw } from 'msw/node';

import type { CreateMock } from '../createMock/createMock';
import type { HandlerArray } from '../createMock/createMock.types';
import type { CreateScenario } from '../createScenario/createScenario';
import type { StateConfig } from '../state/state';
import { state } from '../state/state';

interface GetDynamicMocksArg {
  mocks: CreateMock[];
  scenarios?: CreateScenario[];
  config?: StateConfig;
}

export const getActiveScenarioHandlers = (
  scenarios: GetDynamicMocksArg['scenarios']
): HandlerArray => {
  const scenariosFromState = state.getState().scenarios;
  const scenarioTitles = scenarios.map(({ scenarioTitle }) => scenarioTitle);
  const activeScenario = scenariosFromState?.find(
    ({ isActive, scenarioTitle }) =>
      isActive && scenarioTitles.includes(scenarioTitle)
  );
  return activeScenario?.mockHandlers || [];
};

export const getDynamicMockHandlers = (
  createMocks: GetDynamicMocksArg['mocks']
): HandlerArray => {
  const { mocks } = state.getState();
  const mockTitles = createMocks.map(({ mockTitle }) => mockTitle);
  const filteredMocks = mocks.filter(({ mockTitle }) =>
    mockTitles.includes(mockTitle)
  );
  return filteredMocks.flatMap(({ mockHandlers }) => mockHandlers);
};

export const getDynamicMocks = ({
  mocks,
  scenarios,
  config,
}: GetDynamicMocksArg): HandlerArray => {
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
