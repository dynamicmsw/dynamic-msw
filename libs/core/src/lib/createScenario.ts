import type { RestHandler } from 'msw';

import { convertMockOptions } from './createMock';
import type {
  CreateMockFnReturnType,
  OptionType,
  Options,
  ConvertedOptions,
  CreateMockMockFn,
} from './createMock.types';
import type { MocksState, MockOptionsState } from './state';
import { state } from './state';

// TODO: figure out if something like this is possible
// <
//   B extends CreateMockFnReturnType,
//   T extends { mock: B; options: B['mockOptions'] }[]
// >

type CreateMockOptions = {
  mockOptions: Record<string, OptionType>;
};

type ScenarioMock = {
  mock: CreateMockFnReturnType;
  mockTitle: string;
  mockOptions: CreateMockOptions;
};

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
  mocksFromState.flatMap(({ createMockBaseArgs: { mockFn } }, index) => {
    const mockOptions = createMockOptions[index];
    const initializedMocks = initializeMocks(mockOptions, mockFn);
    if (isActive) {
      global.__mock_worker?.use(initializedMocks);
    }
    return initializedMocks;
  });

const getMockOptionsArray = (
  mocks: ScenarioMock[],
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

export const createScenario = (
  scenarioTitle: string,
  mocks: ScenarioMock[],
  //TODO: merge scenarioTitle andd make it an first param
  {
    openPageURL,
  }: {
    // TODO: think of function openPageURL
    openPageURL?: string;
  } = {}
) => {
  const initialState = state.getState();
  const initialScenarioIndex = initialState.scenarios.findIndex(
    (scenario) => scenario.scenarioTitle === scenarioTitle
  );
  const initialScenario = initialState.scenarios[initialScenarioIndex];

  const mocksFromState = mocks.map(({ mock }) =>
    initialState.mocks.find(({ mockTitle }) => mockTitle === mock.mockTitle)
  );

  const defaultMockOptions = getMockOptionsArray(mocks, mocksFromState);

  const createMockOptions =
    // initialScenario?.mocks.map(({ mockOptions, mockTitle }) => ({
    //   mockOptions: convertMockOptions(mockOptions),
    //   mockTitle,
    // })) ||
    defaultMockOptions;

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
