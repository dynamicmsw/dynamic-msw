import { AllHandlerTypes } from '@dynamic-msw/core';
import { handlerIsCreateScenario } from './handlerIsCreateScenario';

export default function getScenarioEntityIds(
  dynamicHandlers: AllHandlerTypes[]
): string[] {
  return dynamicHandlers
    .filter(handlerIsCreateScenario)
    .map((scenario) => scenario.internals.key);
}
