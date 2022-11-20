import { loadFromStorage, saveToStorage } from '../storageState/storageState';
import type { StateOptions } from './createMock.types';

export interface MocksState {
  mockTitle: string;
  mockOptions: StateOptions;
  openPageURL?: string;
}

export const initialMocksState: MocksState[] = [];

export const addMock = (payload: MocksState) => {
  const { mocks, scenarios } = loadFromStorage();
  const existingMockIndex = mocks.findIndex(
    ({ mockTitle }) => mockTitle === payload.mockTitle
  );
  if (existingMockIndex >= 0) {
    mocks[existingMockIndex] = payload;
  } else {
    mocks.push(payload);
  }
  saveToStorage({ scenarios, mocks });
};

export const updateMock = (payload: Partial<MocksState>) => {
  const { mocks, scenarios } = loadFromStorage();
  const existingMockIndex = mocks.findIndex(
    ({ mockTitle }) => mockTitle === payload.mockTitle
  );
  if (existingMockIndex >= 0) {
    mocks[existingMockIndex] = {
      ...mocks[existingMockIndex],
      ...payload,
    };
    saveToStorage({ scenarios, mocks });
  }
};
