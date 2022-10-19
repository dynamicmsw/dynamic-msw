import type {
  Options,
  ConvertedOptions,
  CreateMockFnReturnType,
  CreateMockMockFn,
  OpenPageFn,
  OptionType,
} from './createMock.types';

export interface MocksState {
  mockTitle: string;
  mockOptions: Options;
  openPageURL?: string;
  dashboardScenarioOnly?: boolean;
  createMockBaseArgs: {
    mockFn: CreateMockMockFn;
    openPageURL: string | OpenPageFn;
  };
  resetMock?: () => void;
  updateMock?: (updateValues: Partial<ConvertedOptions>) => void;
}

export type MockOptionsState = {
  mockTitle: string;
  mockOptions: Record<
    string,
    { defaultValue: OptionType; selectedValue?: OptionType }
  >;
};

export interface ScenariosState {
  scenarioTitle: string;
  mocks: MockOptionsState[];
  isActive?: boolean;
  openPageURL?: string;
  resetMock?: () => void;
}

export interface State {
  mocks: MocksState[];
  scenarios: ScenariosState[];
}

export const dynamicMswStorageKey = 'dynamic-msw-state';

export const saveToStorage = (state: State) => {
  if (typeof sessionStorage !== 'undefined') {
    localStorage.setItem(dynamicMswStorageKey, JSON.stringify(state));
  }
};

export const defaultState = { mocks: [], scenarios: [] };

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
  state: State = loadFromStorage() || defaultState;

  addScenario = (data: ScenariosState) => {
    const existingScenarioIndex = this.state.scenarios.findIndex(
      ({ scenarioTitle }) => scenarioTitle === data.scenarioTitle
    );
    if (existingScenarioIndex >= 0) {
      this.state.scenarios[existingScenarioIndex].resetMock = data.resetMock;
    } else {
      this.state.scenarios.push(data);
      saveToStorage(this.state);
    }

    return data;
  };
  updateScenario = (data: ScenariosState) => {
    const existingScenarioIndex = this.state.scenarios.findIndex(
      ({ scenarioTitle }) => scenarioTitle === data.scenarioTitle
    );

    if (existingScenarioIndex >= 0) {
      this.state.scenarios[existingScenarioIndex] = data;
      saveToStorage(this.state);
    }

    return data;
  };

  addMock = (data: MocksState) => {
    const existingMockIndex = this.state.mocks.findIndex(
      ({ mockTitle }) => mockTitle === data.mockTitle
    );
    if (existingMockIndex >= 0) {
      this.state.mocks[existingMockIndex] = {
        ...this.state.mocks[existingMockIndex],
        updateMock: data.updateMock,
        resetMock: data.resetMock,
        openPageURL: data.openPageURL,
      };
    } else {
      this.state.mocks.push(data);
    }
    saveToStorage(this.state);
  };

  updateMock = (data: MocksState) => {
    const existingMockIndex = this.state.mocks.findIndex(
      ({ mockTitle }) => mockTitle === data.mockTitle
    );
    this.state.mocks[existingMockIndex] = data;
    saveToStorage(this.state);
  };

  resetMocks = () => {
    this.state.mocks.forEach(({ resetMock }) => {
      resetMock?.();
    });
    this.state.scenarios.forEach(({ resetMock }) => {
      resetMock?.();
    });
  };

  getState = () => {
    return this.state;
  };
}

export const state = new CreateState();
