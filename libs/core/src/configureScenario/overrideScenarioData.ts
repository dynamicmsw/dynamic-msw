import { type AnyInternalScenarioDataOverrides } from '../types/CreateScenarioOverrides';
import { type ScenarioMockEntities } from './createScenarioMockEntities';

export default function overrideScenarioData(
  changes: AnyInternalScenarioDataOverrides,
  mockEntities: ScenarioMockEntities,
) {
  Object.entries(changes).forEach(([mockKey, mockData]) => {
    if (mockData) {
      mockEntities[mockKey].internals.overrideData(mockData);
    }
  });
}
