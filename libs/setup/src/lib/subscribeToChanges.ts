import {
  AllHandlerTypes,
  DynamicMockHandlerFn,
  Store,
  selectAllCreateMocks,
} from '@dynamic-msw/core';
import { EntityId } from '@reduxjs/toolkit';
import { RequestHandler } from 'msw';
import { getRequestHandlers } from './getRequestHandlers';
import { HandleUpdate } from '../types/HandleUpdate';

export function subscribeToChanges(
  store: Store,
  handleUpdate: HandleUpdate,
  handlers: AllHandlerTypes[],
  dynamicHandlerMap: Record<EntityId, DynamicMockHandlerFn>,
  prevRequestHandlers: RequestHandler[] | undefined
) {
  let previousCreateMocks = selectAllCreateMocks(store.getState());
  return store.subscribe(() => {
    const currentCreateMocks = selectAllCreateMocks(store.getState());
    if (previousCreateMocks !== currentCreateMocks) {
      previousCreateMocks = currentCreateMocks;
      const initializedHandlers = getRequestHandlers(
        store,
        dynamicHandlerMap,
        handlers,
        prevRequestHandlers
      );
      handleUpdate(initializedHandlers);
    }
  });
}
