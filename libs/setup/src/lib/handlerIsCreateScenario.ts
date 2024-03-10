import {
  type AllHandlerTypes,
  type AnyCreateScenarioApi,
} from '@dynamic-msw/core';

export function handlerIsCreateScenario(
  handler: AllHandlerTypes,
): handler is AnyCreateScenarioApi {
  if (typeof handler !== 'object') return false;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return !!(handler as AnyCreateScenarioApi)?.scenarioKey;
}
