import type {
  MockData,
  MockOptions,
  StoredMockState,
} from '../createMock/createMock.types';
import type { StoredScenarioState } from '../createScenario/createScenario.types';

export const loadFromStorage = <
  T extends StoredMockState<MockOptions> | StoredScenarioState | MockData
>(
  key: string
): T => {
  if (typeof localStorage !== 'undefined') {
    const storageItem = localStorage.getItem(key);
    return storageItem ? (JSON.parse(storageItem) as T) : ({} as T);
  }
  return {} as T;
};

export const saveToStorage = <
  T extends StoredMockState<MockOptions> | StoredScenarioState | MockData
>(
  key: string,
  state: T
) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(state));
  }
};
