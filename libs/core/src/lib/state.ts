import type { Options, ConvertedOptions } from './createMock.types';

export interface MocksState {
  scenarioTitle: string;
  mockOptions: Options;
  pageUrl?: string;
  resetMock?: () => void;
  updateMock?: (updateValues: Partial<ConvertedOptions>) => void;
}

export const dynamicMswStorageKey = 'dynamic-msw-state';

export const saveToStorage = (state: MocksState[]) => {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(dynamicMswStorageKey, JSON.stringify(state));
  }
};

export const loadFromStorage = (): MocksState[] => {
  if (typeof sessionStorage !== 'undefined') {
    return JSON.parse(sessionStorage.getItem(dynamicMswStorageKey) || '[]');
  }
  return [];
};

class CreateState {
  state: {
    mocks: MocksState[];
  } = { mocks: loadFromStorage() };

  addMock = (data: MocksState) => {
    const existingMockIndex = this.state.mocks.findIndex(
      ({ scenarioTitle }) => scenarioTitle === data.scenarioTitle
    );
    if (existingMockIndex >= 0) {
      this.state.mocks[existingMockIndex] = {
        ...this.state.mocks[existingMockIndex],
        updateMock: data.updateMock,
        resetMock: data.resetMock,
      };
    } else {
      this.state.mocks.push(data);
    }
    saveToStorage(this.state.mocks);
  };

  updateMock = (data: MocksState) => {
    const existingMockIndex = this.state.mocks.findIndex(
      ({ scenarioTitle }) => scenarioTitle === data.scenarioTitle
    );
    this.state.mocks[existingMockIndex] = data;
    saveToStorage(this.state.mocks);
  };

  getState = () => {
    return this.state;
  };
}

export const state = new CreateState();
