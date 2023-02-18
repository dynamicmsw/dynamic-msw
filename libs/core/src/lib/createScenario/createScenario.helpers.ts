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
    const currData = data?.[curr];
    const currOptions = options?.[curr];
    return {
      ...prev,
      [curr]: createMock(
        {
          title: createScenarioMockKey(title, currMock._title),
          data: currData || currMock._initialMockData,
          options: currOptions
            ? Object.keys(currOptions).reduce((prevOptions, currOptionKey) => {
                const currValue = currOptions[currOptionKey];
                return {
                  ...prevOptions,
                  [currOptionKey]: {
                    ...prevOptions[currOptionKey],
                    defaultValue: currValue,
                    selectedValue: currValue,
                  },
                };
              }, currMock._initialStorageOptions)
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
