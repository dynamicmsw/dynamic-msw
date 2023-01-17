import type { RequestHandler, SetupWorkerApi } from 'msw';
import type { SetupServerApi } from 'msw/lib/node';

import type {
  CreateMockPrivateReturnType,
  CreateMockReturnType,
} from '../createMock/createMock';
import type {
  CreateScenarioPrivateReturnType,
  CreateScenarioReturnType,
} from '../createScenario/createScenario';
import type {
  Config,
  SetupServerOrWorkerApi,
  SetupServerOrWorker,
  SetupServer,
} from '../types';

type ResetHandlersObj = {
  resetAllHandlers: (handlers?: RequestHandler[]) => void;
};

export type SetupReturnType<T extends SetupServerOrWorkerApi> = Omit<
  T,
  'resetHandlers'
> &
  ResetHandlersObj & {
    setConfig: (config: Config) => Omit<T, 'resetHandlers'> & ResetHandlersObj;
  };

export type SetupHandlers = Array<
  | RequestHandler
  | CreateMockReturnType<any, any>
  | CreateScenarioReturnType<any>
>;

export const setupDynamicServer = <
  T extends SetupServerOrWorker,
  Y extends T extends SetupServer ? SetupServerApi : SetupWorkerApi
>(
  serverOrWorker: T,
  originalHandlers: SetupHandlers,
  config?: Config
): SetupReturnType<Y> => {
  const dynamicHandlers = originalHandlers.reduce((prev, curr) => {
    if ((curr as CreateScenarioPrivateReturnType)._scenarioMocks) {
      prev.push(curr as CreateMockPrivateReturnType);
    } else if ((curr as CreateMockPrivateReturnType).updateOptions) {
      prev.push(curr as CreateMockPrivateReturnType);
    }
    return prev;
  }, [] as CreateMockPrivateReturnType[]);

  if (config) {
    dynamicHandlers.forEach(({ _setConfig }) => {
      _setConfig(config);
    });
  }

  const worker = serverOrWorker(
    ...originalHandlers.reduce((prev, curr) => {
      const currIsActive = (curr as CreateMockPrivateReturnType)._isActive;
      if (
        config &&
        config.filterActive &&
        typeof currIsActive !== 'undefined' &&
        !currIsActive
      ) {
        return prev;
      }
      if ((curr as CreateScenarioPrivateReturnType)._scenarioMocks) {
        prev = [
          ...prev,
          ...(curr as CreateScenarioPrivateReturnType)._initializedMockHandlers,
        ];
      } else if ((curr as CreateMockPrivateReturnType).updateOptions) {
        prev = [
          ...prev,
          ...(curr as CreateMockPrivateReturnType)._initializedMockHandlers,
        ];
      } else {
        prev.push(curr as RequestHandler);
      }
      return prev;
    }, [] as RequestHandler[])
  ) as unknown as SetupReturnType<Y>;

  worker.setConfig = (config) => {
    return setupDynamicServer(serverOrWorker, originalHandlers, config);
  };

  dynamicHandlers.forEach(({ _setServerOrWorker }) => {
    _setServerOrWorker(worker as unknown as SetupServerOrWorkerApi);
  });

  worker.resetAllHandlers = (handlers = []) => {
    dynamicHandlers.forEach(({ reset }) => {
      reset();
    });
    (worker as unknown as SetupServerOrWorkerApi).resetHandlers(...handlers);
  };

  return worker as unknown as SetupReturnType<Y>;
};
