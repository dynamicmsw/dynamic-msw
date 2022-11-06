import type {
  StateOptions,
  ConvertedOptions,
  CreateMockHandlerFn,
  HandlerArray,
} from '../createMock/createMock.types';

export interface StateConfig {
  saveToLocalStorage: boolean;
}

export interface MocksState {
  mockTitle: string;
  mockOptions: StateOptions;
  openPageURL?: string;
  mockHandlers?: HandlerArray;
  createMockHandler?: CreateMockHandlerFn;
  resetMock?: () => void;
  updateMock?: (updateValues: Partial<ConvertedOptions>) => void;
}

export type MockOptionsState = {
  originalMockTitle: string;
  mockTitle: string;
  mockOptions: StateOptions;
};

export interface ScenariosState {
  scenarioTitle: string;
  mocks: MockOptionsState[];
  mockHandlers?: HandlerArray;
  isActive?: boolean;
  openPageURL?: string;
  resetMocks?: () => void;
}

export interface State {
  mocks: MocksState[];
  scenarios: ScenariosState[];
}

export const dynamicMswStorageKey = 'dynamic-msw-state';
export const defaultState: State = { mocks: [], scenarios: [] };
const defaultStateConfig = { saveToLocalStorage: true };

export const saveToStorage = async (
  state: State,
  config: StateConfig = defaultStateConfig
) => {
  if (typeof sessionStorage !== 'undefined' && config.saveToLocalStorage) {
    const cleanedState = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      scenarios: state.scenarios.map(({ resetMocks, ...data }) => data),
      mocks: state.mocks.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ mockHandlers, createMockHandler, updateMock, resetMock, ...data }) =>
          data
      ),
    };
    localStorage.setItem(dynamicMswStorageKey, JSON.stringify(cleanedState));
  }
};

export const loadFromStorage = (): State => {
  if (typeof localStorage !== 'undefined') {
    const storageItem = localStorage.getItem(dynamicMswStorageKey);
    return storageItem
      ? JSON.parse(localStorage.getItem(dynamicMswStorageKey))
      : defaultState;
  }
  return defaultState;
};

class CreateState {
  private state: State;
  private config: StateConfig;

  constructor() {
    this.config = defaultStateConfig;
    this.state =
      (this.config.saveToLocalStorage && loadFromStorage()) || defaultState;
  }

  public get currentState() {
    return this.state;
  }

  public addScenario = (data: ScenariosState) => {
    const existingScenarioIndex = this.state.scenarios.findIndex(
      ({ scenarioTitle }) => scenarioTitle === data.scenarioTitle
    );
    if (existingScenarioIndex >= 0) {
      this.state.scenarios[existingScenarioIndex] = {
        ...this.state.scenarios[existingScenarioIndex],
        resetMocks: data.resetMocks,
        mockHandlers: data.mockHandlers,
      };
    } else {
      this.state.scenarios.push(data);
      saveToStorage(this.state, this.config);
    }

    return data;
  };

  public updateScenario = (data: Partial<ScenariosState>) => {
    const existingScenarioIndex = this.state.scenarios.findIndex(
      ({ scenarioTitle }) => scenarioTitle === data.scenarioTitle
    );

    if (existingScenarioIndex >= 0) {
      this.state.scenarios[existingScenarioIndex] = {
        ...this.state.scenarios[existingScenarioIndex],
        ...data,
      };
      saveToStorage(this.state, this.config);
    }

    return data;
  };

  public addMock = (data: MocksState) => {
    const existingMockIndex = this.state.mocks.findIndex(
      ({ mockTitle }) => mockTitle === data.mockTitle
    );
    const existingMock = this.state.mocks[existingMockIndex];
    if (existingMock) {
      this.state.mocks[existingMockIndex] = {
        ...existingMock,
        updateMock: data.updateMock,
        resetMock: data.resetMock,
        openPageURL: data.openPageURL,
        createMockHandler: data.createMockHandler,
        mockHandlers: data.mockHandlers,
      };
    } else {
      this.state.mocks.push(data);
    }
    saveToStorage(this.state, this.config);
  };

  public updateMock = (data: Partial<MocksState>) => {
    const existingMockIndex = this.state.mocks.findIndex(
      ({ mockTitle }) => mockTitle === data.mockTitle
    );
    this.state.mocks[existingMockIndex] = {
      ...this.state.mocks[existingMockIndex],
      ...data,
    };
    saveToStorage(this.state, this.config);
  };

  public setConfig = (config: StateConfig) => {
    this.config = { ...this.config, ...config };
  };

  public resetMocks = () => {
    this.state.mocks.forEach(({ resetMock }) => {
      resetMock?.();
    });
    this.state.scenarios.forEach(({ resetMocks }) => {
      resetMocks?.();
    });
  };
}

export const state = new CreateState();
