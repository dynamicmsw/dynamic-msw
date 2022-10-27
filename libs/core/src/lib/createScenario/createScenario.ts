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

type OpenPageURL<T extends Mocks> =
  | string
  | OpenPageFn<{ [K in keyof T]: Parameters<T[K]['updateMock']>[0] }>
  | null;

type OptionsArg<T extends Mocks> =
  | {
      scenarioTitle: string;
      openPageURL?: OpenPageURL<T>;
    }
  | string;

type MockOptionsArg<T extends Mocks> = {
  [K in keyof T]: Parameters<T[K]['updateMock']>[0];
};

export class CreateScenario<T extends Mocks = Mocks> {
  public scenarioTitle: string;
  private openPageURL: OpenPageURL<T>;
  private mocks: T;
  private mockOptions: MockOptionsArg<T>;

  constructor(
    optionsArg: OptionsArg<T>,
    mocks: T,
    mockOptions: MockOptionsArg<T>
  ) {
    const { scenarioTitle, openPageURL } =
      typeof optionsArg === 'string'
        ? { scenarioTitle: optionsArg, openPageURL: null }
        : optionsArg;
    this.scenarioTitle = scenarioTitle;
    this.openPageURL = openPageURL;
    this.mocks = mocks;
    this.mockOptions = mockOptions;
    this.initializeScenario();
  }

  private get getOpenPageURL() {
    return getOpenPageURL(this.openPageURL, this.mockOptions);
  }

  private get initialScenarioState() {
    const initialState = state.currentState;
    return initialState.scenarios.find(
      (scenario) => scenario.scenarioTitle === this.scenarioTitle
    );
  }

  private get mappedOptionsToMocks() {
    return Object.keys(this.mocks).map((key) => ({
      mock: this.mocks[key],
      mockOptions: this.mockOptions[key],
    }));
  }

  private get mocksFromState() {
    // Get mocks from state so that we can use it's default options
    const initialState = state.currentState;
    return this.mappedOptionsToMocks.map(({ mock }) =>
      initialState.mocks.find(({ mockTitle }) => mockTitle === mock.mockTitle)
    );
  }

  private get createMockOptions(): CreateMockOptions[] {
    // TODO: perhaps we can simplify this
    const defaultMockOptions = getMockOptionsAndTitleArray(
      this.mappedOptionsToMocks
    );

    return (
      this.initialScenarioState?.mocks.map(({ mockOptions, mockTitle }) => ({
        mockOptions: getActiveOptions(mockOptions),
        mockTitle,
      })) || defaultMockOptions
    );
  }

  private get initializedMocks() {
    return initializeManyMocks({
      mocksFromState: this.mocksFromState,
      createMockOptions: this.createMockOptions,
    });
  }

  private initializeScenario = () => {
    state.addScenario({
      ...(this.initialScenarioState || {}),
      scenarioTitle: this.scenarioTitle,
      openPageURL: this.getOpenPageURL,
      mocks: convertToStateMockOptions(
        this.createMockOptions,
        this.mocksFromState
      ),
      resetMocks: this.resetMocks,
      mockHandlers: this.initializedMocks,
    });
  };

  public resetMocks = () => {
    state.updateScenario({
      ...(this.initialScenarioState || {}),
      scenarioTitle: this.scenarioTitle,
      mocks: convertToStateMockOptions(
        this.createMockOptions,
        this.mocksFromState
      ),
      resetMocks: this.resetMocks,
      mockHandlers: this.initializedMocks,
    });
  };

  public activateScenario = () => {
    global.__mock_worker?.use(...this.initializedMocks);
  };
}

export const createScenario = <T extends Mocks>(
  optionsArg: OptionsArg<T>,
  mocks: T,
  mockOptions: MockOptionsArg<T>
) => new CreateScenario<T>(optionsArg, mocks, mockOptions);
