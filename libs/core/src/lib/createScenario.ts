import type { RestHandler } from 'msw';

import { convertMockOptions } from './createMock';
import type {
  CreateMockFnReturnType,
  OptionType,
  CreateMockMockFn,
} from './createMock.types';
import type { MocksState, MockOptionsState } from './state';
import { state } from './state';

type CreateMockOptions = {
  mockOptions: Record<string, OptionType>;
  mockTitle: string;
};

// TODO: fix type defs
type ScenarioMock<T extends CreateMockFnReturnType[]> = {
  [K in keyof T]: {
    mock: T[K];
    mockOptions: Parameters<T[K]['updateMock']>[0];
  };
};

type Mocks = Record<string, CreateMockFnReturnType>;

type SetupMocksFn = (
  options: CreateMockOptions,
  mockFn: CreateMockMockFn
) => RestHandler[];

const initializeMocks: SetupMocksFn = (options, mockFn) => {
  const mockFnReturnValue = mockFn(options.mockOptions);
  const arrayOfMocks = Array.isArray(mockFnReturnValue)
    ? mockFnReturnValue
    : [mockFnReturnValue];
  return arrayOfMocks;
};

const initializeManyMocks = ({
  mocksFromState,
  createMockOptions,
  isActive,
}: {
  mocksFromState: MocksState[];
  createMockOptions: CreateMockOptions[];
  isActive?: boolean;
}) =>
  mocksFromState.flatMap(({ mockFn }, index) => {
    const mockOptions = createMockOptions[index];
    const initializedMocks = initializeMocks(mockOptions, mockFn);
    if (isActive) {
      global.__mock_worker?.use(initializedMocks);
    }
    return initializedMocks;
  });

const getMockOptionsArray = (
  mocks: ScenarioMock<CreateMockFnReturnType[]>,
  mocksFromState: MocksState[]
) =>
  mocks.map(({ mockOptions }, index) => ({
    mockTitle: mocksFromState[index].mockTitle,
    mockOptions,
  }));

const convertToStateMockOptions = (
  mockOptions: CreateMockOptions[],
  mocksFromState: MocksState[]
): MockOptionsState[] =>
  mockOptions.map((mockOption, index) => ({
    mockTitle: mocksFromState[index].mockTitle,
    mockOptions: Object.keys(mockOption.mockOptions).reduce(
      (prev, key) => ({
        ...prev,
        [key]: { defaultValue: mockOption.mockOptions[key] },
      }),
      {}
    ),
  }));

export const createScenario = <T extends Mocks>(
  optionsArg:
    | {
        scenarioTitle: string;
        // TODO: think of function openPageURL
        openPageURL?: string | null;
      }
    | string,
  mocks: T,
  mockOptions: { [K in keyof T]: Parameters<T[K]['updateMock']>[0] }
) => {
  const { openPageURL, scenarioTitle } =
    typeof optionsArg === 'string'
      ? { scenarioTitle: optionsArg, openPageURL: null }
      : optionsArg;

  const initialState = state.getState();
  const initialScenarioIndex = initialState.scenarios.findIndex(
    (scenario) => scenario.scenarioTitle === scenarioTitle
  );
  const initialScenario = initialState.scenarios[initialScenarioIndex];

  const mappedOptionsToMocks = Object.keys(mocks).map((key) => ({
    mock: mocks[key],
    mockOptions: mockOptions[key],
  }));

  const mocksFromState = mappedOptionsToMocks.map(({ mock }) =>
    initialState.mocks.find(({ mockTitle }) => mockTitle === mock.mockTitle)
  );

  const defaultMockOptions = getMockOptionsArray(
    mappedOptionsToMocks,
    mocksFromState
  );

  const createMockOptions: CreateMockOptions[] =
    initialScenario?.mocks.map(({ mockOptions, mockTitle }) => ({
      mockOptions: convertMockOptions(mockOptions),
      mockTitle,
    })) || defaultMockOptions;

  const initializedMocks = initializeManyMocks({
    mocksFromState,
    createMockOptions: createMockOptions,
  });

  const scenarioReturnValue = {
    mocks: initializedMocks,
    scenarioTitle,
    resetMock: () => {
      scenarioReturnValue.mocks = initializeManyMocks({
        mocksFromState,
        createMockOptions: createMockOptions,
      });
      state.updateScenario({
        ...(initialScenario || {}),
        scenarioTitle,
        mocks: convertToStateMockOptions(createMockOptions, mocksFromState),
        resetMock: scenarioReturnValue.resetMock,
      });
    },
  };
  state.addScenario({
    ...(initialScenario || {}),
    scenarioTitle,
    openPageURL,
    mocks: convertToStateMockOptions(createMockOptions, mocksFromState),
    resetMock: scenarioReturnValue.resetMock,
  });
  return scenarioReturnValue;
};
