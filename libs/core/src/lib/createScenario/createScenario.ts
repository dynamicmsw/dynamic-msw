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

  public set PRIVATE_setConfig(config: StateConfig) {
    this.shouldSaveToStorage =
      typeof config?.saveToLocalStorage !== 'undefined'
        ? config?.saveToLocalStorage
        : true;
    this.initializeScenario();
  }

  private get mapScenarioMocksToState(): ScenarioMockOptionsState[] {
    return Object.keys(this.mocks).map((key) => {
      const currentMock = this.mocks[key];
      const currentMockTitle = currentMock.mockTitle;
      const initialScenarioMocksState = this.initialScenarioState?.mocks.find(
        ({ mockTitle }) => mockTitle === key
      );
      const mergeMockOptions = Object.keys(currentMock.mockOptions).reduce(
        (prev, stateMockOptionKey) => {
          const selectedValue =
            initialScenarioMocksState?.mockOptions[stateMockOptionKey]
              .selectedValue;
          const defaultValue = this.mockOptions?.[key][stateMockOptionKey];
          const sourceMockOption = currentMock.mockOptions[stateMockOptionKey];
          const isArray = Array.isArray(sourceMockOption);
          const sourceMockOptionIsObject =
            typeof sourceMockOption === 'object' &&
            !Array.isArray(sourceMockOption);
          return {
            ...prev,
            [stateMockOptionKey]: {
              ...(sourceMockOptionIsObject ? sourceMockOption : {}),
              ...(isArray ? { options: sourceMockOption } : {}),
              ...(typeof defaultValue !== 'undefined'
                ? { defaultValue }
                : {
                    defaultValue: sourceMockOptionIsObject
                      ? //TODO: type defs got nasty so it needs some refactoring
                        (sourceMockOption as { defaultValue?: unknown })
                          .defaultValue
                      : sourceMockOption,
                  }),
              selectedValue,
            },
          };
        },
        {}
      );

      return {
        originalMockTitle: currentMockTitle,
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
