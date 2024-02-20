import { EntityId, Unsubscribe } from '@reduxjs/toolkit';
import { RequestHandler } from 'msw';
import {
  DynamicMockHandlerFn,
  Store,
  createMockActions,
} from '@dynamic-msw/core';

import { AllHandlerTypes } from '@dynamic-msw/core';
import { getDynamicHandlerMap } from './lib/getDynamicHandlerMap';
import { initializeCreateMocks } from './lib/initializeCreateMocks';
import { getRequestHandlers } from './lib/getRequestHandlers';
import { subscribeToChanges } from './lib/subscribeToChanges';
import { HandleUpdate } from './types/HandleUpdate';

export class Setup {
  private store: Store;
  private handleUpdate: HandleUpdate;
  private dynamicHandlerMap!: Record<EntityId, DynamicMockHandlerFn>;
  private unsubscribe?: Unsubscribe;
  private initialHandlers: AllHandlerTypes[];
  private currentHandlers: AllHandlerTypes[];
  public initializedHandlers?: RequestHandler[];

  constructor(
    store: Store,
    handlers: AllHandlerTypes[],
    handleUpdate: HandleUpdate
  ) {
    this.handleUpdate = handleUpdate;
    this.initialHandlers = handlers;
    this.currentHandlers = handlers;
    this.store = store;
    this.initialize();
  }
  private initialize = () => {
    this.unsubscribe?.();
    initializeCreateMocks(this.store, this.currentHandlers);
    this.dynamicHandlerMap = getDynamicHandlerMap(this.currentHandlers);
    this.initializedHandlers = getRequestHandlers(
      this.store,
      this.dynamicHandlerMap,
      this.currentHandlers,
      this.initializedHandlers
    );
    this.unsubscribe = subscribeToChanges(
      this.store,
      this.handleUpdate,
      this.currentHandlers,
      this.dynamicHandlerMap,
      this.initializedHandlers
    );
  };

  public resetHandlers = (...nextHandlers: AllHandlerTypes[]) => {
    this.store.dispatch(createMockActions.resetAll());
    this.initializedHandlers = undefined;
    if (nextHandlers.length > 0) {
      this.initialHandlers = nextHandlers;
      this.currentHandlers = nextHandlers;
    } else {
      this.currentHandlers = this.initialHandlers;
    }
    this.initialize();
  };
  public use = (...nextHandlers: AllHandlerTypes[]) => {
    this.currentHandlers = [...this.currentHandlers, ...nextHandlers];
    this.initialize();
  };
}
