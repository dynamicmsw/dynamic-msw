import { setupWorker } from 'msw';
import type { RestHandler, SetupWorkerApi } from 'msw';
import type { SetupServerApi, setupServer as setupServerMsw } from 'msw/node';

import type { CreateMock } from '../createMock/createMock';
import type { HandlerArray } from '../createMock/createMock.types';
import type { CreateScenario } from '../createScenario/createScenario';
import type { StateConfig } from '../storageState/storageState';
import { loadFromStorage } from '../storageState/storageState';

interface GetDynamicMocksArg {
  mocks?: CreateMock[];
  scenarios?: CreateScenario[];
  config?: StateConfig;
}

const ensureUniqueTitles = (
  mocks: GetDynamicMocksArg['mocks'],
  scenarios: GetDynamicMocksArg['scenarios']
) => {
  mocks
    ?.map(({ mockTitle }) => mockTitle)
    .sort()
    .reduce((prev, curr) => {
      if (prev === curr) {
        throw Error(
          `Duplicate mock title found: ${curr}. Please ensure mock titles are unique.`
        );
      }
      return curr;
    });
  scenarios
    ?.map(({ scenarioTitle }) => scenarioTitle)
    .sort()
    .reduce((prev, curr) => {
      if (prev === curr) {
        throw Error(
          `Duplicate scenario title found: ${curr}. Please ensure scenario titles are unique.`
        );
      }
      return curr;
    });
};

export const getActiveScenarioHandlers = (
  scenarios: GetDynamicMocksArg['scenarios']
): HandlerArray => {
  const scenariosFromState = loadFromStorage().scenarios;
  const activeScenario = scenarios?.find(({ scenarioTitle }) =>
    scenariosFromState.find(
      (scenarioFromState) =>
        scenarioFromState.isActive &&
        scenarioTitle === scenarioFromState.scenarioTitle
    )
  );
  return activeScenario?.mockHandlers || [];
};

export const getDynamicMockHandlers = (
  createMocks: GetDynamicMocksArg['mocks']
): HandlerArray => {
  return createMocks.flatMap(({ mockHandlers }) => mockHandlers);
};

export const getDynamicMocks = ({
  mocks,
  scenarios,
  config,
}: GetDynamicMocksArg): HandlerArray => {
  ensureUniqueTitles(mocks, scenarios);
  if (global.__mock_worker) {
    // Already initialized before.
    try {
      global.__mock_worker.stop?.();
      global.__mock_worker.close?.();
    } catch {
      // ignore errors
    }
  }

  mocks?.forEach((mock) => {
    mock.PRIVATE_setConfig = config;
  });
  scenarios?.forEach((scenario) => {
    scenario.PRIVATE_setConfig = config;
  });
  global.__mock_worker_reset_mocks = () => {
    mocks?.forEach(({ resetMock }) => resetMock());
    scenarios?.forEach(({ resetMocks }) => resetMocks());
  };

  const dynamicMocksHandlers = getDynamicMockHandlers(mocks);
  const activeScenarioHandlers = getActiveScenarioHandlers(scenarios);
  return [...activeScenarioHandlers, ...dynamicMocksHandlers];
};

export const resetDynamicMocks = () => {
  global.__mock_worker_reset_mocks();
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

type SetupWorkerArg<
  T extends SetupServerArgs | SetupWorkerArgs =
    | SetupServerArgs
    | SetupWorkerArgs
> = GetDynamicMocksArg &
  (T extends SetupServerArgs ? SetupServerArgs : SetupWorkerArgs) & {
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
  resetDynamicMocks();
  global.__mock_worker?.resetHandlers();
};
