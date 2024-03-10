import { type AnyCreateMockApi } from '../types/AnyCreateMockApi';

export default function createScenarioMockEntities(mocks: AnyCreateMockApi[]) {
  return mocks.reduce<ScenarioMockEntities>((acc, curr) => {
    acc[curr.mockKey] = curr;
    return acc;
  }, {});
}

export type ScenarioMockEntities = Record<string, AnyCreateMockApi>;
