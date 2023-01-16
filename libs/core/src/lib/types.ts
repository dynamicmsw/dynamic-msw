import type { GraphQLHandler, RestHandler, SetupWorkerApi } from 'msw';
import type { SetupServerApi } from 'msw/lib/node';

export type MswHandlers = RestHandler | GraphQLHandler;

export type ArrayElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ArrayElementType> ? ArrayElementType : never;

export interface Config {
  saveToStorage?: boolean;
  filterActive?: boolean;
}

export type ServerOrWorker = SetupWorkerApi | SetupServerApi;
