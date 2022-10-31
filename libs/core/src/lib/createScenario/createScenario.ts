import { getActiveOptions } from '../createMock/createMock.helpers';
import type { MockOptionsState } from '../state/state';
import { state } from '../state/state';
import { initializeManyMocks, getOpenPageURL } from './createScenario.helpers';
import type {
  OpenPageURL,
  Mocks,
  MockOptionsArg,
  OptionsArg,
} from './createScenario.types';

export class CreateScenario<T extends Mocks = Mocks> {
  public scenarioTitle: string;
  private openPageURL: OpenPageURL<T>;
  private mocks: T;
  private mockOptions: MockOptionsArg<T>;
  private initialMockOptions: MockOptionsArg<T>;

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
    this.initialMockOptions = mockOptions;
    this.initializeScenario();
  }

  private get getOpenPageURL() {
    return getOpenPageURL(this.openPageURL, this.activeOptions);
  }

  private get initialScenarioState() {
    const initialState = state.currentState;
    return initialState.scenarios.find(
      (scenario) => scenario.scenarioTitle === this.scenarioTitle
    );
  }

  private get mocksFromState() {
    // Get mocks from state so that we can use it's default options
    const initialState = state.currentState;
    return Object.keys(this.mocks).map((key) =>
      initialState.mocks.find(({ mockTitle }) => {
        return mockTitle === this.mocks[key].mockTitle;
      })
    );
  }

  private getMockFromState(key: keyof T) {
    return this.mocksFromState.find(({ mockTitle }) => mockTitle === key);
  }

  private get mapScenarioMocksToState(): MockOptionsState[] {
    return Object.keys(this.mocks).map((key) => {
      const currentMockTitle = this.mocks[key].mockTitle;
      const mockDataFromState = this.getMockFromState(currentMockTitle);
      const initialScenarioMockState = this.initialScenarioState?.mocks.find(
        ({ mockTitle }) => mockTitle === key
      );

      const mergeMockOptions = Object.keys(
        mockDataFromState.mockOptions
      ).reduce((prev, stateMockOptionKey) => {
        const selectedValue =
          initialScenarioMockState?.mockOptions[stateMockOptionKey]
            .selectedValue;
        const defaultValue = this.mockOptions[key][stateMockOptionKey];
        return {
          ...prev,
          [stateMockOptionKey]: {
            ...mockDataFromState.mockOptions[stateMockOptionKey],
            ...(typeof defaultValue !== 'undefined' ? { defaultValue } : {}),
            ...(typeof selectedValue !== 'undefined' ? { selectedValue } : {}),
          },
        };
      }, {});

      return {
        originalMockTitle: mockDataFromState.mockTitle,
        mockTitle: key,
        mockOptions: mergeMockOptions,
      };
    });
  }

  private get activeOptions() {
    return this.mapScenarioMocksToState.map(({ mockTitle, mockOptions }) => {
      return {
        mockTitle,
        mockOptions: getActiveOptions(mockOptions),
      };
    });
  }

  private get initializedMocks() {
    return initializeManyMocks({
      mocksFromState: this.mocksFromState,
      createMockOptions: this.activeOptions,
    });
  }

  private initializeScenario = () => {
    state.addScenario({
      ...(this.initialScenarioState || {}),
      scenarioTitle: this.scenarioTitle,
      openPageURL: this.getOpenPageURL,
      mocks: this.mapScenarioMocksToState,
      resetMocks: this.resetMocks,
      mockHandlers: this.initializedMocks,
    });
  };

  private updateMockOptions = (updateOptions: MockOptionsArg<T>) => {
    this.mockOptions = {
      ...this.mockOptions,
      ...Object.keys(updateOptions).reduce(
        (prev, mockOptionKey) => ({
          ...prev,
          [mockOptionKey]: {
            ...this.mockOptions[mockOptionKey],
            ...updateOptions[mockOptionKey],
          },
        }),
        {}
      ),
    };
  };

  public updateScenario = (updateOptions: MockOptionsArg<T>) => {
    this.updateMockOptions(updateOptions);
    state.updateScenario({
      ...(this.initialScenarioState || {}),
      scenarioTitle: this.scenarioTitle,
      mocks: this.mapScenarioMocksToState,
      resetMocks: this.resetMocks,
      mockHandlers: this.initializedMocks,
    });
    this.activateScenario();
  };

  public resetMocks = () => {
    this.mockOptions = this.initialMockOptions;
    state.updateScenario({
      ...(this.initialScenarioState || {}),
      scenarioTitle: this.scenarioTitle,
      mocks: this.mapScenarioMocksToState,
      resetMocks: this.resetMocks,
      mockHandlers: this.initializedMocks,
    });
    this.activateScenario();
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
