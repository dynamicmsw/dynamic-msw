import type { CreateMock } from '../createMock/createMock';
import type { MocksState, MockOptionsState } from '../state/state';
import type {
  SetupMocksFn,
  CreateMockOptions,
  ScenarioMock,
  OpenPageFn,
} from './createScenario.types';

const initializeMocks: SetupMocksFn = (options, createMockHandler) => {
  const createMockHandlerReturnValue = createMockHandler(options.mockOptions);
  const arrayOfMocks = Array.isArray(createMockHandlerReturnValue)
    ? createMockHandlerReturnValue
    : [createMockHandlerReturnValue];
  return arrayOfMocks;
};

export const initializeManyMocks = ({
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

export const getMockOptionsAndTitleArray = (
  mocks: ScenarioMock<CreateMock[]>
) =>
  mocks.map(({ mockOptions, mock }) => ({
    mockTitle: mock.mockTitle,
    mockOptions,
  }));

export const convertToStateMockOptions = (
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

export const getOpenPageURL = (
  openPageURL: string | OpenPageFn<unknown>,
  mockOptions: unknown
) =>
  typeof openPageURL === 'function' ? openPageURL(mockOptions) : openPageURL;
