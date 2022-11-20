import type { StateOptions } from '../createMock/createMock.types';
import { loadFromStorage, saveToStorage } from '../storageState/storageState';

export type ScenarioMockOptionsState = {
  originalMockTitle: string;
  mockTitle: string;
  mockOptions: StateOptions;
};

export interface ScenariosState {
  scenarioTitle: string;
  mocks: ScenarioMockOptionsState[];
  isActive?: boolean;
  openPageURL?: string;
}

export const initialScenariosState: ScenariosState[] = [];

export const addScenario = (payload: ScenariosState) => {
  const { scenarios, mocks } = loadFromStorage();
  const existingScenarioIndex = scenarios.findIndex(
    ({ scenarioTitle }) => scenarioTitle === payload.scenarioTitle
  );
  if (existingScenarioIndex >= 0) {
    scenarios[existingScenarioIndex] = payload;
  } else {
    scenarios.push(payload);
  }

  saveToStorage({ scenarios, mocks });
};

export const updateScenario = (payload: Partial<ScenariosState>) => {
  const { mocks, scenarios } = loadFromStorage();
  const existingScenarioIndex = scenarios.findIndex(
    ({ scenarioTitle }) => scenarioTitle === payload.scenarioTitle
  );
  if (existingScenarioIndex >= 0) {
    scenarios[existingScenarioIndex] = {
      ...scenarios[existingScenarioIndex],
      ...payload,
    };
    saveToStorage({ scenarios, mocks });
  }
};
