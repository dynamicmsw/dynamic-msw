import { AnyInternalScenarioParameterOverrides } from '../types/CreateScenarioOverrides';
import { ScenarioMockEntities } from './createScenarioMockEntities';

export default function overrideScenarioParameters(
  changes: AnyInternalScenarioParameterOverrides,
  mockEntities: ScenarioMockEntities
) {
  Object.entries(changes).forEach(([mockKey, parameters]) => {
    if (parameters) {
      mockEntities[mockKey].internals.overrideParameters(parameters);
    }
  });
}
