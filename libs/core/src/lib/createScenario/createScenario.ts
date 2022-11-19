import { getActiveOptions } from '../createMock/createMock.helpers';
import type { StateConfig } from '../storageState/storageState';
import { loadFromStorage } from '../storageState/storageState';
import { initializeManyMocks, getOpenPageURL } from './createScenario.helpers';
import type {
  OpenPageURL,
  Mocks,
  MockOptionsArg,
  OptionsArg,
} from './createScenario.types';
import type { ScenarioMockOptionsState } from './scenariosStorage';
import { addScenario, updateScenario } from './scenariosStorage';

export class CreateScenario<T extends Mocks = Mocks> {
  public scenarioTitle: string;
  private openPageURL: OpenPageURL<T>;
  private mocks: T;
  private mockOptions: MockOptionsArg<T>;
  private initialMockOptions: MockOptionsArg<T>;
  private shouldSaveToStorage = true;

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
  }

  private get stateFromStorage() {
    return loadFromStorage();
  }

  private get getOpenPageURL() {
    return getOpenPageURL(this.openPageURL, this.activeOptions);
  }

  private get initialScenarioState() {
    return this.stateFromStorage.scenarios.find(
      (scenario) => scenario.scenarioTitle === this.scenarioTitle
    );
  }

  private get mocksFromState() {
    // Get mocks from state so that we can use it's default options
    const initialState = this.stateFromStorage.mocks;
    return Object.keys(this.mocks).map((key) =>
      initialState.find(({ mockTitle }) => {
        return mockTitle === this.mocks[key].mockTitle;
      })
    );
  }

  public set PRIVATE_setConfig(config: StateConfig) {
    this.shouldSaveToStorage =
      typeof config?.saveToLocalStorage !== 'undefined'
        ? config?.saveToLocalStorage
        : true;
    this.initializeScenario();
  }

  private getMockFromState(key: keyof T) {
    return this.mocksFromState.find(({ mockTitle }) => mockTitle === key);
  }

  private get mapScenarioMocksToState(): ScenarioMockOptionsState[] {
    return Object.keys(this.mocks).map((key) => {
      const currentMockTitle = this.mocks[key].mockTitle;
      const mockDataFromState = this.getMockFromState(currentMockTitle);
      const initialScenarioMocksState = this.initialScenarioState?.mocks.find(
        ({ mockTitle }) => mockTitle === key
      );
      const mergeMockOptions = Object.keys(
        mockDataFromState.mockOptions
      ).reduce((prev, stateMockOptionKey) => {
        const selectedValue =
          initialScenarioMocksState?.mockOptions[stateMockOptionKey]
            .selectedValue;
        const defaultValue = this.mockOptions?.[key][stateMockOptionKey];
        return {
          ...prev,
          [stateMockOptionKey]: {
            ...mockDataFromState.mockOptions[stateMockOptionKey],
            ...(typeof defaultValue !== 'undefined' ? { defaultValue } : {}),
            selectedValue,
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

  public get mockHandlers() {
    return initializeManyMocks({
      mocks: this.mocks,
      createMockOptions: this.activeOptions,
    });
  }

  private initializeScenario = () => {
    if (this.shouldSaveToStorage) {
      addScenario({
        ...(this.initialScenarioState || {}),
        scenarioTitle: this.scenarioTitle,
        openPageURL: this.getOpenPageURL,
        mocks: this.mapScenarioMocksToState,
      });
    }
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
    this.activateScenario();
    if (this.shouldSaveToStorage) {
      updateScenario({
        ...(this.initialScenarioState || {}),
        scenarioTitle: this.scenarioTitle,
        mocks: this.mapScenarioMocksToState,
      });
    }
  };

  public resetMocks = () => {
    this.mockOptions = this.initialMockOptions;
    this.activateScenario();
    if (this.shouldSaveToStorage) {
      updateScenario({
        ...(this.initialScenarioState || {}),
        scenarioTitle: this.scenarioTitle,
        mocks: this.mapScenarioMocksToState,
      });
    }
  };

  public activateScenario = () => {
    global.__mock_worker?.use(...this.mockHandlers);
  };
}

export const createScenario = <T extends Mocks>(
  optionsArg: OptionsArg<T>,
  mocks: T,
  mockOptions?: MockOptionsArg<T>
) => new CreateScenario<T>(optionsArg, mocks, mockOptions);

export type CreateScenarioFn = typeof createScenario;
