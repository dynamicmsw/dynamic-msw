import { Unsubscribe } from '@reduxjs/toolkit';
import { RequestHandler } from 'msw';
import {
  Store,
  configureMockActions,
  configureScenarioActions,
  createStore,
} from '@dynamic-msw/core';

import { AllHandlerTypes } from '@dynamic-msw/core';
import { initializeCreateMocks } from './lib/initializeCreateMocks';
import { getRequestHandlers } from './lib/getRequestHandlers';
import { subscribeToChanges } from './lib/subscribeToChanges';
import { HandleUpdate } from './types/HandleUpdate';
import { subscribeToOpenPageURLChanges } from './lib/subscribeToOpenPageURL';
import { CreateMockReturnValueMap } from './types/CreateMockReturnValueMap';
import { getCreateMockReturnValueMap } from './lib/getCreateMockReturnValueMap';
import resetAllCreateMocks from './lib/resetAllCreateMocks';
import getMockEntityIds from './lib/getMockEntityIds';
import getScenarioEntityIds from './lib/getScenarioEntityIds';

export class Setup {
  private store!: Store;
  private isDashboard: boolean;
  private handleUpdate: HandleUpdate;
  private dynamicHandlerInternalsMap!: CreateMockReturnValueMap;
  private unsubscribe?: Unsubscribe;
  private unsubscribeToOpenPageURL?: Unsubscribe;
  private initialHandlers: AllHandlerTypes[];
  private currentHandlers: AllHandlerTypes[];
  public initializedHandlers?: RequestHandler[];

  constructor(
    handlers: AllHandlerTypes[],
    handleUpdate: HandleUpdate,
    isDashboard: boolean
  ) {
    this.handleUpdate = handleUpdate;
    this.initialHandlers = handlers;
    this.currentHandlers = handlers;
    this.isDashboard = !!isDashboard;
  }
  private initialize = () => {
    initializeCreateMocks(this.store, this.currentHandlers);
    this.dynamicHandlerInternalsMap = getCreateMockReturnValueMap(
      this.currentHandlers
    );
    this.initializedHandlers = getRequestHandlers(
      this.store,
      this.dynamicHandlerInternalsMap,
      this.currentHandlers,
      this.isDashboard,
      this.initializedHandlers
    );
  };

  public resetHandlers = (...nextHandlers: AllHandlerTypes[]) => {
    resetAllCreateMocks(this.dynamicHandlerInternalsMap);
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

  public start = () => {
    this.store = createStore(this.isDashboard, this.isDashboard);
    if (this.isDashboard) {
      this.unsubscribeToOpenPageURL = subscribeToOpenPageURLChanges(this.store);
    }
    this.initialize();

    this.unsubscribe = subscribeToChanges(this.store, () =>
      this.handleUpdate(
        getRequestHandlers(
          this.store,
          this.dynamicHandlerInternalsMap,
          this.currentHandlers,
          this.isDashboard,
          this.initializedHandlers
        )
      )
    );
    this.store.dispatch(
      configureMockActions.pruneEntities(getMockEntityIds(this.currentHandlers))
    );
    this.store.dispatch(
      configureScenarioActions.pruneEntities(
        getScenarioEntityIds(this.currentHandlers)
      )
    );
  };
  public stop = () => {
    this.unsubscribe?.();
    this.unsubscribeToOpenPageURL?.();
  };
}
