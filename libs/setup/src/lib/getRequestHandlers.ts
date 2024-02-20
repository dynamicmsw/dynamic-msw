import {
  DynamicMockHandlerFn,
  Store,
  selectCreateMockById,
} from '@dynamic-msw/core';
import { EntityId } from '@reduxjs/toolkit';
import { RequestHandler } from 'msw';
import { handlerIsCreateMock } from './handlerIsCreateMock';
import { getParameterValues } from './getParameterValues';
import { handlerIsCreateScenario } from './handlerIsCreateScenario';
import { AllHandlerTypes } from '@dynamic-msw/core';

export function getRequestHandlers(
  store: Store,
  dynamicHandlerMap: Record<EntityId, DynamicMockHandlerFn>,
  handlers: AllHandlerTypes[],
  prevRequestHandlers: RequestHandler[] | undefined
) {
  const nextRequestHandlers = handlers.flatMap((handler) => {
    if (handlerIsCreateMock(handler)) {
      const entityId = handler.internals.getEntityId();
      const createMockState = selectCreateMockById(entityId)(store.getState());
      return dynamicHandlerMap[entityId](getParameterValues(createMockState));
    } else if (handlerIsCreateScenario(handler)) {
      return handler.internals.getMocks().flatMap((mock) => {
        const entityId = mock.internals.getEntityId();
        const createMockState = selectCreateMockById(entityId)(
          store.getState()
        );
        return dynamicHandlerMap[entityId](getParameterValues(createMockState));
      });
    }
    return handler;
  });
  if (prevRequestHandlers) {
    return nextRequestHandlers.map((nextHandler, index) => {
      if (prevRequestHandlers[index]?.isUsed) {
        nextHandler.isUsed = true;
      }
      return nextHandler;
    });
  } else {
    return nextRequestHandlers.map((nextHandler) => {
      nextHandler.isUsed = false;
      return nextHandler;
    });
  }
}
