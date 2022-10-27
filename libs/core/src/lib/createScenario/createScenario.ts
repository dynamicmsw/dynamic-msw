import { getActiveOptions } from '../createMock/createMock.helpers';
import { state } from '../state/state';
import {
  initializeManyMocks,
  getMockOptionsAndTitleArray,
  convertToStateMockOptions,
  getOpenPageURL,
} from './createScenario.helpers';
import type {
  OpenPageURL,
  Mocks,
  MockOptionsArg,
  OptionsArg,
  CreateMockOptions,
} from './createScenario.types';

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

export type CreateScenarioFn = typeof createScenario;
