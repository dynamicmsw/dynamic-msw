import type { CreateMockPrivateReturnType } from '../createMock/createMock';
import { createMock } from '../createMock/createMock';
import type {
  CreateScenarioMocks,
  ScenarioCreateMocks,
  UpdateScenarioData,
  UpdateScenarioOptions,
} from './createScenario.types';

export const createScenarioMocks = <T extends CreateScenarioMocks>(
  mocks: T,
  title: string,
  options: UpdateScenarioOptions<T> | undefined,
  data: UpdateScenarioData<T> | undefined
) =>
  Object.keys(mocks).reduce((prev, curr) => {
    const currMock = mocks[curr] as unknown as CreateMockPrivateReturnType;
    return {
      ...prev,
      [curr]: createMock(
        {
          title: createScenarioMockKey(title, currMock._title),
          openPageURL: currMock._openPageURL,
          data: data?.[curr] || currMock._initialMockData,
          options: options?.[curr]
            ? Object.keys(options[curr]).reduce(
                (prevOptions, currOptionKey) => {
                  const currValue = options[curr][currOptionKey];
                  return {
                    ...prevOptions,
                    [currOptionKey]: {
                      ...prevOptions[currOptionKey],
                      defaultValue: currValue,
                      selectedValue: currValue,
                    },
                  };
                },
                currMock._initialStorageOptions
              )
            : currMock._initialStorageOptions,
        },
        currMock._createMockHandler
      ),
    };
  }, {} as ScenarioCreateMocks<T>);

export const createScenarioKey = (scenarioTitle: string) =>
  `__scenario__.${scenarioTitle}`;

export const createScenarioMockKey = (
  scenarioTitle: string,
  mockTitle: string
) => `${createScenarioKey(scenarioTitle)}.__mock__.${mockTitle}`;
