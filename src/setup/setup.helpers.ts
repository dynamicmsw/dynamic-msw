import { DynamicMockHandlerFn } from "../types/DynamicMockHandlerFn";
import { Store } from "../state/store";
import { EntityId } from "@reduxjs/toolkit";

import { RequestHandler, SetupApi } from "msw";
import { type CreateMockReturnType } from "../createMock/createMock";
import {
  CreateMockEntity,
  selectAllCreateMocks,
  selectCreateMockById,
} from "../state/createMock.slice";
import { CreateScenarioReturnType } from "../createScenario/createScenario";
import { AllHandlerTypes } from "../types/AllHandlerTypes";

export function subscribeToChanges(
  store: Store,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  use: SetupApi<any>["use"],
  handlers: Array<AllHandlerTypes>,
  dynamicHandlerMap: Record<EntityId, DynamicMockHandlerFn>,
  prevInitializedHandlers: RequestHandler[] | undefined
) {
  let previousCreateMocks = selectAllCreateMocks(store.getState());
  return store.subscribe(() => {
    const currentCreateMocks = selectAllCreateMocks(store.getState());
    if (previousCreateMocks !== currentCreateMocks) {
      previousCreateMocks = currentCreateMocks;
      const initializedHandlers = getInitializedHandlers(
        store,
        dynamicHandlerMap,
        handlers,
        prevInitializedHandlers
      );
      use(...initializedHandlers);
    }
  });
}

export function initializeCreateMocks(
  store: Store,
  handlers: Array<AllHandlerTypes>
) {
  handlers.forEach((handler) => {
    if (handlerIsCreateMock(handler)) {
      handler.internals.initialize(store, undefined);
    } else if (handlerIsCreateScenario(handler)) {
      handler.internals.initialize(store);
    }
  }, {} as Record<EntityId, DynamicMockHandlerFn>);
}

export function getDynamicHandlerMap(handlers: Array<AllHandlerTypes>) {
  return handlers.reduce((acc, handler) => {
    if (handlerIsCreateMock(handler)) {
      acc[handler.internals.getEntityId()] = handler.internals.getHandlers();
    } else if (handlerIsCreateScenario(handler)) {
      handler.internals.getMocks().forEach((mock) => {
        acc[mock.internals.getEntityId()] = mock.internals.getHandlers();
      });
    }
    return acc;
  }, {} as Record<EntityId, DynamicMockHandlerFn>);
}

export function getInitializedHandlers(
  store: Store,
  dynamicHandlerMap: Record<EntityId, DynamicMockHandlerFn>,
  handlers: Array<AllHandlerTypes>,
  prevInitializedHandlers: RequestHandler[] | undefined
) {
  const nextHandlers = handlers.flatMap((handler) => {
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
  if (prevInitializedHandlers) {
    return nextHandlers.map((nextHandler, index) => {
      if (prevInitializedHandlers[index]?.isUsed) {
        nextHandler.isUsed = true;
      }
      return nextHandler;
    });
  } else {
    return nextHandlers.map((nextHandler) => {
      nextHandler.isUsed = false;
      return nextHandler;
    });
  }

  return nextHandlers;
}

export function getParameterValues(createMockEntity: CreateMockEntity) {
  if (!createMockEntity.parameters) return {};
  return Object.entries(createMockEntity.parameters).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value.currentValue || value.defaultValue || null,
    }),
    {}
  );
}

export function handlerIsCreateMock(
  handler: AllHandlerTypes
): handler is CreateMockReturnType {
  if (typeof handler !== "object") return false;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return !!(handler as CreateMockReturnType)?.internals?.isCreateMock;
}
export function handlerIsCreateScenario(
  handler: AllHandlerTypes
): handler is CreateScenarioReturnType {
  if (typeof handler !== "object") return false;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return !!(handler as CreateScenarioReturnType)?.internals?.isCreateScenario;
}
