import type {
  StateOptions,
  ConvertedOptions,
  CreateMockMockFn,
  OptionType,
} from './createMock.types';

export interface MocksState {
  mockTitle: string;
  mockOptions: StateOptions;
  openPageURL?: string;
  dashboardScenarioOnly?: boolean;
  mockFn?: CreateMockMockFn;
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
  resetMocks?: () => void;
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
      this.state.scenarios[existingScenarioIndex].resetMocks = data.resetMocks;
    } else {
      this.state.scenarios.push(data);
      saveToStorage(this.state);
    }

    return data;
  };

  updateScenario = (data: Partial<ScenariosState>) => {
    const existingScenarioIndex = this.state.scenarios.findIndex(
      ({ scenarioTitle }) => scenarioTitle === data.scenarioTitle
    );

    if (existingScenarioIndex >= 0) {
      this.state.scenarios[existingScenarioIndex] = {
        ...this.state.scenarios[existingScenarioIndex],
        ...data,
      };
      saveToStorage(this.state);
    }

    return data;
  };

  addMock = (data: MocksState) => {
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
        mockFn: data.mockFn,
      };
    } else {
      this.state.mocks.push(data);
    }

    if (existingMock?.mockFn) {
      console.warn(
        `Looks like you initialized 2 createMock functions with the same mock title: '${existingMock.mockTitle}'. Please ensure the mockTitle option is unique across your mocks.`
      );
    }
    saveToStorage(this.state);
  };

  updateMock = (data: Partial<MocksState>) => {
    const existingMockIndex = this.state.mocks.findIndex(
      ({ mockTitle }) => mockTitle === data.mockTitle
    );
    this.state.mocks[existingMockIndex] = {
      ...this.state.mocks[existingMockIndex],
      ...data,
    };
    saveToStorage(this.state);
  };

  resetMocks = () => {
    this.state.mocks.forEach(({ resetMock }) => {
      resetMock?.();
    });
    this.state.scenarios.forEach(({ resetMocks }) => {
      resetMocks?.();
    });
  };

  getState = () => {
    return this.state;
  };
}

export const state = new CreateState();
