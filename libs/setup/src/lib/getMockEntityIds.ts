import { type AllHandlerTypes } from '@dynamic-msw/core';
import { handlerIsCreateMock } from './handlerIsCreateMock';
import { handlerIsCreateScenario } from './handlerIsCreateScenario';
import { type EntityId } from '@reduxjs/toolkit';

export default function getMockEntityIds(
  dynamicHandlers: AllHandlerTypes[],
): EntityId[] {
  return dynamicHandlers.flatMap((handler) => {
    if (handlerIsCreateMock(handler)) {
      return handler.internals.getEntityId();
    } else if (handlerIsCreateScenario(handler)) {
      return handler.internals
        .getMocks()
        .map((mock) => mock.internals.getEntityId());
    }
    return [];
  });
}
