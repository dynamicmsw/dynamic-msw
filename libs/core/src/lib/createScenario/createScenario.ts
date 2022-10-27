import { getActiveOptions } from '../createMock/createMock';
import type { CreateMock } from '../createMock/createMock';
import type {
  ConvertedOptions,
  CreateMockHandlerFn,
  HandlerArray,
} from '../createMock/createMock.types';
import type { MocksState, MockOptionsState } from '../state/state';
import { state } from '../state/state';

type CreateMockOptions = {
  mockOptions: ConvertedOptions;
  mockTitle: string;
};

type ScenarioMock<T extends CreateMock[]> = {
  [K in keyof T]: {
    mock: T[K];
    mockOptions: Parameters<T[K]['updateMock']>[0];
  };
};

type Mocks = Record<string, CreateMock>;

type SetupMocksFn = (
  options: CreateMockOptions,
  createMockHandler: CreateMockHandlerFn
) => HandlerArray;

type OpenPageFn<T> = (mockConfig: T) => string;

const initializeMocks: SetupMocksFn = (options, createMockHandler) => {
  const createMockHandlerReturnValue = createMockHandler(options.mockOptions);
  const arrayOfMocks = Array.isArray(createMockHandlerReturnValue)
    ? createMockHandlerReturnValue
    : [createMockHandlerReturnValue];
  return arrayOfMocks;
};

const initializeManyMocks = ({
  mocksFromState,
  createMockOptions,
}: {
  mocksFromState: MocksState[];
  createMockOptions: CreateMockOptions[];
}) =>
  mocksFromState.flatMap(({ createMockHandler }, index) => {
    const mockOptions = createMockOptions[index];
    const initializedMocks = initializeMocks(mockOptions, createMockHandler);
    return initializedMocks;
  });

const getMockOptionsAndTitleArray = (mocks: ScenarioMock<CreateMock[]>) =>
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
