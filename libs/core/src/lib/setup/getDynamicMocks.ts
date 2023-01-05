import type { SetupWorkerApi } from 'msw';
import type { SetupServerApi } from 'msw/node';

import type { CreateMockReturnType } from '../createMock/createMock';
import type {
  CreateScenarioPrivateReturnType,
  CreateScenarioReturnType,
} from '../createScenario/createScenario';
import type { Config, MswHandlers } from '../types';

export const getDynamicMocks = ({
  mocks,
  scenarios,
  config,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mocks?: CreateMockReturnType<any, any>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scenarios?: CreateScenarioReturnType<any>[];
  config?: Partial<Config>;
}): {
  handlers: MswHandlers[];
  reset: () => void;
  setServer: (server: SetupServerApi) => void;
  setWorker: (worker: SetupWorkerApi) => void;
} => {
  const allCreators = [...(mocks || []), ...(scenarios || [])];
  const handlers = allCreators.flatMap((creator) => {
    if (config) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (creator as unknown as CreateScenarioPrivateReturnType<any>)._setConfig(
        config
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (creator as unknown as CreateScenarioPrivateReturnType<any>)
      ._initializedMockHandlers;
  });
  return {
    handlers: handlers,
    reset() {
      allCreators.forEach((creator) => {
        creator.reset();
      });
    },
    setServer(server) {
      allCreators.forEach((creator) => {
        (creator as unknown as CreateScenarioPrivateReturnType<any>) // eslint-disable-line @typescript-eslint/no-explicit-any
          ._setServerOrWorker(server);
      });
    },
    setWorker(worker) {
      allCreators.forEach((creator) => {
        (creator as unknown as CreateScenarioPrivateReturnType<any>) // eslint-disable-line @typescript-eslint/no-explicit-any
          ._setServerOrWorker(worker);
      });
    },
  };
};
