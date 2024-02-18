import { SetupServerApi as SetupServerApiOriginal } from "msw/node";
import { DynamicMockHandlerFn } from "../types/DynamicMockHandlerFn";
import { createStore, Store } from "../state/store";
import { EntityId, Unsubscribe } from "@reduxjs/toolkit";
import {
  type Interceptor,
  type HttpRequestEventMap,
} from "@mswjs/interceptors";
import { RequestHandler } from "msw";
import { type CreateMockReturnType } from "../createMock/createMock";
import { createMockActions } from "../state/createMock.slice";
import {
  getDynamicHandlerMap,
  getInitializedHandlers,
  initializeCreateMocks,
  subscribeToChanges,
} from "../setup/setup.helpers";
import { AllHandlerTypes } from "../types/AllHandlerTypes";

export default class SetupServerApi extends SetupServerApiOriginal {
  private dynamicHandlerMap: Record<EntityId, DynamicMockHandlerFn>;
  private unsubscribe: Unsubscribe;
  private dynamicInitialHandlers: Array<AllHandlerTypes>;
  private store: Store;
  private prevInitializedHandlers: RequestHandler[];

  constructor(
    interceptors: Array<{
      new (): Interceptor<HttpRequestEventMap>;
    }>,
    ...handlers: Array<AllHandlerTypes>
  ) {
    const { store } = createStore();
    initializeCreateMocks(store, handlers);
    const dynamicHandlerMap = getDynamicHandlerMap(handlers);

    const initializedHandlers = getInitializedHandlers(
      store,
      dynamicHandlerMap,
      handlers,
      undefined
    );
    super(interceptors, ...initializedHandlers);
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
  resetHandlers = (
    ...nextHandlers: Array<RequestHandler | CreateMockReturnType>
  ) => {
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
      undefined
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
  use = (...nextHandlers: Array<RequestHandler | CreateMockReturnType>) => {
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
