import { AllHandlerTypes, CreateScenarioReturnType } from '@dynamic-msw/core';

export function handlerIsCreateScenario(
  handler: AllHandlerTypes
): handler is CreateScenarioReturnType {
  if (typeof handler !== 'object') return false;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return !!(handler as CreateScenarioReturnType)?.internals?.isCreateScenario;
}
