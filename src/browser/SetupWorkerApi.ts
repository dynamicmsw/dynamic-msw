import { SetupWorkerApi as SetupWorkerApiOriginal } from "msw/browser";
import { DynamicMockHandlerFn } from "../types/DynamicMockHandlerFn";
import { EntityId, Store, Unsubscribe } from "@reduxjs/toolkit";
import { RequestHandler } from "msw";
import { createMockActions } from "../state/createMock.slice";
import {
  getDynamicHandlerMap,
  getInitializedHandlers,
  initializeCreateMocks,
  subscribeToChanges,
} from "../setup/setup.helpers";
import { createStore } from "../state/store";
import { AllHandlerTypes } from "../types/AllHandlerTypes";

// TODO: try to extract duplicate logic from SetupServerApi
export default class SetupWorkerApi extends SetupWorkerApiOriginal {
  private dynamicHandlerMap: Record<EntityId, DynamicMockHandlerFn>;
  private unsubscribe: Unsubscribe;
  private dynamicInitialHandlers: Array<AllHandlerTypes>;
  private store: Store;
  private prevInitializedHandlers: RequestHandler[];

  constructor(isDashboard: boolean, handlers: Array<AllHandlerTypes>) {
    const { store } = createStore(isDashboard, isDashboard);
    initializeCreateMocks(store, handlers);
    const dynamicHandlerMap = getDynamicHandlerMap(handlers);

    const initializedHandlers = getInitializedHandlers(
      store,
      dynamicHandlerMap,
      handlers,
      undefined
    );
    super(...initializedHandlers);
    this.store = store;
    this.dynamicHandlerMap = dynamicHandlerMap;
    this.unsubscribe = subscribeToChanges(
      store,
      this.use,
      handlers,
      dynamicHandlerMap,
      undefined
    );
    this.dynamicInitialHandlers = handlers;
    this.prevInitializedHandlers = initializedHandlers;
  }
  resetHandlers = (...nextHandlers: Array<AllHandlerTypes>) => {
    const handlers =
      nextHandlers.length > 0 ? nextHandlers : this.dynamicInitialHandlers;
    this.dynamicInitialHandlers = handlers;
    this.unsubscribe();
    this.store.dispatch(createMockActions.resetAll());
    initializeCreateMocks(this.store, handlers);
    this.dynamicHandlerMap = getDynamicHandlerMap(handlers);

    const initializedHandlers = getInitializedHandlers(
      this.store,
      this.dynamicHandlerMap,
      handlers,
      this.prevInitializedHandlers
    );
    this.prevInitializedHandlers = initializedHandlers;
    super.resetHandlers(...initializedHandlers);
    this.unsubscribe = subscribeToChanges(
      this.store,
      this.use,
      handlers,
      this.dynamicHandlerMap,
      this.prevInitializedHandlers
    );
  };
  use = (...nextHandlers: Array<AllHandlerTypes>) => {
    this.unsubscribe();
    const handlers = [...this.dynamicInitialHandlers, ...nextHandlers];
    initializeCreateMocks(this.store, handlers);
    const dynamicHandlerMap = getDynamicHandlerMap(handlers);

    const initializedHandlers = getInitializedHandlers(
      this.store,
      dynamicHandlerMap,
      handlers,
      this.prevInitializedHandlers
    );
    this.prevInitializedHandlers = initializedHandlers;
    super.use(...initializedHandlers);
    this.unsubscribe = subscribeToChanges(
      this.store,
      this.use,
      handlers,
      dynamicHandlerMap,
      this.prevInitializedHandlers
    );
  };
}
