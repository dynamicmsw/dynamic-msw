import { type Store, selectCreateMockById } from '@dynamic-msw/core';
import { type RequestHandler } from 'msw';
import { handlerIsCreateMock } from './handlerIsCreateMock';
import { getParameterValues } from './getParameterValues';
import { handlerIsCreateScenario } from './handlerIsCreateScenario';
import { type AllHandlerTypes } from '@dynamic-msw/core';
import { type CreateMockReturnValueMap } from '../types/CreateMockReturnValueMap';

export function getRequestHandlers(
  store: Store,
  dynamicHandlerMap: CreateMockReturnValueMap,
  handlers: AllHandlerTypes[],
  isDashboard: boolean | undefined,
  prevRequestHandlers: RequestHandler[] | undefined,
) {
  const nextRequestHandlers = handlers.flatMap((handler) => {
    if (handlerIsCreateMock(handler)) {
      const entityId = handler.internals.getEntityId();
      const configureMockState = selectCreateMockById(entityId)(
        store.getState(),
      );
      if (isDashboard && !configureMockState.isActive) return [];
      return dynamicHandlerMap[entityId].internals.getHandlers()(
        getParameterValues(configureMockState),
        configureMockState.data!,
        dynamicHandlerMap[entityId].updateData!,
      );
    } else if (handlerIsCreateScenario(handler)) {
      return handler.internals.getMocks().flatMap((mock) => {
        const entityId = mock.internals.getEntityId();
        const configureMockState = selectCreateMockById(entityId)(
          store.getState(),
        );
        if (isDashboard && !configureMockState.isActive) return [];
        return dynamicHandlerMap[entityId].internals.getHandlers()(
          getParameterValues(configureMockState),
          configureMockState.data!,
          dynamicHandlerMap[entityId].updateData!,
        );
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
