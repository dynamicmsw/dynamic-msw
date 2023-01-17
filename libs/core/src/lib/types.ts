import type { setupWorker, SetupWorkerApi } from 'msw';
import type { setupServer, SetupServerApi } from 'msw/lib/node';

export type ArrayElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ArrayElementType> ? ArrayElementType : never;

export interface Config {
  saveToStorage?: boolean;
  filterActive?: boolean;
}

export type SetupServer = typeof setupServer;
export type SetupWorker = typeof setupWorker;

export type SetupServerOrWorker = SetupServer | SetupWorker;
export type SetupServerOrWorkerApi = SetupWorkerApi | SetupServerApi;
