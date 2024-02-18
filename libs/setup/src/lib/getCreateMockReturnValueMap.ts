import { handlerIsCreateMock } from './handlerIsCreateMock';
import { handlerIsCreateScenario } from './handlerIsCreateScenario';
import { AllHandlerTypes } from '@dynamic-msw/core';
import { CreateMockReturnValueMap } from '../types/CreateMockReturnValueMap';

export function getCreateMockReturnValueMap(handlers: AllHandlerTypes[]) {
  return handlers.reduce((acc, handler) => {
    if (handlerIsCreateMock(handler)) {
      acc[handler.internals.getEntityId()] = handler;
    } else if (handlerIsCreateScenario(handler)) {
      handler.internals.getMocks().forEach((mock) => {
        acc[mock.internals.getEntityId()] = mock;
      });
    }
    return acc;
  }, {} as CreateMockReturnValueMap);
}
