import { AnyInternalScenarioDataOverrides } from '../types/CreateScenarioOverrides';
import { ScenarioMockEntities } from './createScenarioMockEntities';

export default function overrideScenarioData(
  changes: AnyInternalScenarioDataOverrides,
  mockEntities: ScenarioMockEntities
) {
  Object.entries(changes).forEach(([mockKey, mockData]) => {
    if (mockData) {
      mockEntities[mockKey].internals.overrideData(mockData);
    }
  });
}
