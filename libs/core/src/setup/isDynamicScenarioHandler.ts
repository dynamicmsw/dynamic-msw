import { type AnyCreateScenarioApi } from '../configureScenario/types/AnyCreateScenarioApi';
import { type AllHandlerTypes } from './types/AllHandlerTypes';

export function isDynamicScenarioHandler(
  handler: AllHandlerTypes,
): handler is AnyCreateScenarioApi {
  if (typeof handler !== 'object') return false;
  return !!(handler as AnyCreateScenarioApi).scenarioKey;
}
