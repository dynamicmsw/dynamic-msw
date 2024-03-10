import { type RequestHandler } from 'msw';
import { type AnyCreateMockPublicApi } from './AnyCreateMockApi';
import { type AnyCreateMockApi } from './AnyCreateMockApi';
import { type AnyCreateScenarioApi } from './AnyCreateScenarioApi';
import { type AnyCreateScenarioPublicApi } from './AnyCreateScenarioApi';

export type AllPublicHandlerTypes =
  | RequestHandler
  | AnyCreateMockPublicApi
  | AnyCreateScenarioPublicApi;

export type AllHandlerTypes =
  | RequestHandler
  | AnyCreateMockApi
  | AnyCreateScenarioApi;
