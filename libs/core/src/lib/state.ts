import type {
  Config,
  CreateMockFnState,
  CreateMockFnStateValue,
} from './createMock.types';

export interface StorageState {
  createMocksConfig: Record<
    string,
    {
      updatedConfig: CreateMockFnStateValue['convertedConfig'];
      config: Config;
      pageUrl?: string;
    }
  >;
}

export const dynamicMswStorageKey = 'dynamic-msw-state';

const saveToStorage = (state: StorageState) => {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(dynamicMswStorageKey, JSON.stringify(state));
  }
};

const loadFromStorage = (): StorageState | Record<string, never> => {
  if (typeof sessionStorage !== 'undefined') {
    return JSON.parse(sessionStorage.getItem(dynamicMswStorageKey));
  }
  return {};
};

class CreateState {
  state: {
    createMocks: CreateMockFnState;
  } = { createMocks: {} };

  storageState: StorageState = {
    createMocksConfig: {},
  };

  initializeCreateMocksFromStorage = () => {
    const storedState = loadFromStorage();
    if (storedState?.createMocksConfig) {
      Object.keys(storedState.createMocksConfig).forEach((key) => {
        const mockInsideState = this.state.createMocks[key];
        if (mockInsideState) {
          mockInsideState.updateMock(
            storedState.createMocksConfig[key].updatedConfig
          );
        }
      });
    }
  };

  upsertCreateMock = (id: string, mockState: CreateMockFnStateValue) => {
    this.state.createMocks[id] = mockState;
    this.storageState.createMocksConfig[id] = {
      config: mockState.config,
      pageUrl: mockState.pageUrl,
      updatedConfig: mockState.convertedConfig,
    };
    saveToStorage(this.storageState);
  };

  getState = () => this.state;
}

export const state = new CreateState();
