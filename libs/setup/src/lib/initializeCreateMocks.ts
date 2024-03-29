import {
  type AllHandlerTypes,
  type AnyDynamicMockHandlerFn,
  type Store,
} from '@dynamic-msw/core';
import { handlerIsCreateMock } from './handlerIsCreateMock';
import { handlerIsCreateScenario } from './handlerIsCreateScenario';
import { type EntityId } from '@reduxjs/toolkit';

export function initializeCreateMocks(
  store: Store,
  handlers: AllHandlerTypes[],
) {
  handlers.forEach(
    (handler) => {
      if (handlerIsCreateMock(handler)) {
        handler.internals.initialize(store, undefined, undefined);
      } else if (handlerIsCreateScenario(handler)) {
        handler.internals.initialize(store);
      }
    },
    {} as Record<EntityId, AnyDynamicMockHandlerFn>,
  );
}
