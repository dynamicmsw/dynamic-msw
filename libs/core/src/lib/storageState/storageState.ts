import type { MocksState } from '../createMock/mocksStorage';
import type { ScenariosState } from '../createScenario/scenariosStorage';

export interface State {
  mocks: MocksState[];
  scenarios: ScenariosState[];
}
export interface StateConfig {
  saveToLocalStorage: boolean;
}
export const defaultStateConfig = { saveToLocalStorage: true };
export const dynamicMswStorageKey = 'dynamic-msw-state';
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

export const saveToStorage = async (
  state: State,
  config: StateConfig = defaultStateConfig
) => {
  if (typeof sessionStorage !== 'undefined' && config.saveToLocalStorage) {
    localStorage.setItem(dynamicMswStorageKey, JSON.stringify(state));
  }
};
