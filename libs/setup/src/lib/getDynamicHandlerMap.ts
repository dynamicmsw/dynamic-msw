import { EntityId } from '@reduxjs/toolkit';
import { handlerIsCreateMock } from './handlerIsCreateMock';
import { handlerIsCreateScenario } from './handlerIsCreateScenario';
import { AnyDynamicMockHandlerFn } from '@dynamic-msw/core';
import { AllHandlerTypes } from '@dynamic-msw/core';

export function getDynamicHandlerMap(handlers: AllHandlerTypes[]) {
  return handlers.reduce((acc, handler) => {
    if (handlerIsCreateMock(handler)) {
      acc[handler.internals.getEntityId()] = handler.internals.getHandlers();
    } else if (handlerIsCreateScenario(handler)) {
      handler.internals.getMocks().forEach((mock) => {
        acc[mock.internals.getEntityId()] = mock.internals.getHandlers();
      });
    }
    return acc;
  }, {} as Record<EntityId, AnyDynamicMockHandlerFn>);
}
