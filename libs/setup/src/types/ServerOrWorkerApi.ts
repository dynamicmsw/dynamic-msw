import { type SetupWorkerApi } from 'msw/browser';
import { type SetupServerApi } from 'msw/node';

export type ServerOrWorkerApi = SetupServerApi | SetupWorkerApi;
