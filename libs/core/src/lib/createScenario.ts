import type { RestHandler } from 'msw';

import { getActiveOptions } from './createMock';
import type {
  CreateMockFnReturnType,
  ConvertedOptions,
  CreateMockMockFn,
} from './createMock.types';
import type { MocksState, MockOptionsState } from './state';
import { state } from './state';

type CreateMockOptions = {
  mockOptions: ConvertedOptions;
  mockTitle: string;
};

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

type OpenPageFn<T> = (mockConfig: T) => string;

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

const getMockOptionsAndTitleArray = (
  mocks: ScenarioMock<CreateMockFnReturnType[]>
) =>
  mocks.map(({ mockOptions, mock }) => ({
    mockTitle: mock.mockTitle,
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

const getOpenPageURL = (
  openPageURL: string | OpenPageFn<unknown>,
  mockOptions: unknown
) =>
  typeof openPageURL === 'function' ? openPageURL(mockOptions) : openPageURL;

export const createScenario = <T extends Mocks>(
  optionsArg:
    | {
        scenarioTitle: string;
        openPageURL?:
          | string
          | OpenPageFn<{ [K in keyof T]: Parameters<T[K]['updateMock']>[0] }>;
      }
    | string,
  mocks: T,
  mockOptions: { [K in keyof T]: Parameters<T[K]['updateMock']>[0] }
) => {
  const { scenarioTitle, ...restOptions } =
    typeof optionsArg === 'string'
      ? { scenarioTitle: optionsArg, openPageURL: null }
      : optionsArg;

  const openPageURL = getOpenPageURL(restOptions.openPageURL, mockOptions);

  const initialState = state.getState();
  const initialScenarioStateIndex = initialState.scenarios.findIndex(
    (scenario) => scenario.scenarioTitle === scenarioTitle
  );
  const initialScenarioState =
    initialState.scenarios[initialScenarioStateIndex];

  // Mapping mockOptions arg to passed mocks
  const mappedOptionsToMocks = Object.keys(mocks).map((key) => ({
    mock: mocks[key],
    mockOptions: mockOptions[key],
  }));

  // Get mocks from state so that we can use it's default options
  const mocksFromState = mappedOptionsToMocks.map(({ mock }) =>
    initialState.mocks.find(({ mockTitle }) => mockTitle === mock.mockTitle)
  );

  // TODO: perhaps we can simplify this
  // Get only the title and mocks handler array
  const defaultMockOptions = getMockOptionsAndTitleArray(mappedOptionsToMocks);

  const createMockOptions: CreateMockOptions[] =
    initialScenarioState?.mocks.map(({ mockOptions, mockTitle }) => ({
      mockOptions: getActiveOptions(mockOptions),
      mockTitle,
    })) || defaultMockOptions;

  const initializedMocks = initializeManyMocks({
    mocksFromState,
    createMockOptions: createMockOptions,
  });

  const scenarioReturnValue = {
    mocks: initializedMocks,
    scenarioTitle,
    resetMocks: () => {
      scenarioReturnValue.mocks = initializeManyMocks({
        mocksFromState,
        createMockOptions: createMockOptions,
      });
      state.updateScenario({
        ...(initialScenarioState || {}),
        scenarioTitle,
        mocks: convertToStateMockOptions(createMockOptions, mocksFromState),
        resetMocks: scenarioReturnValue.resetMocks,
      });
    },
    activateScenario: () => {
      global.__mock_worker?.use(...scenarioReturnValue.mocks);
    },
  };
  state.addScenario({
    ...(initialScenarioState || {}),
    scenarioTitle,
    openPageURL,
    mocks: convertToStateMockOptions(createMockOptions, mocksFromState),
    resetMocks: scenarioReturnValue.resetMocks,
  });
  return scenarioReturnValue;
};
