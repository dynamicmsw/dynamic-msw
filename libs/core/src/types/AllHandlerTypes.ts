import { RequestHandler } from 'msw';
import { AnyCreateMockPublicApi } from './AnyCreateMockApi';
import { AnyCreateMockApi } from './AnyCreateMockApi';
import { AnyCreateScenarioApi } from './AnyCreateScenarioApi';
import { AnyCreateScenarioPublicApi } from './AnyCreateScenarioApi';

export type AllPublicHandlerTypes =
  | RequestHandler
  | AnyCreateMockPublicApi
  | AnyCreateScenarioPublicApi;

export type AllHandlerTypes =
  | RequestHandler
  | AnyCreateMockApi
  | AnyCreateScenarioApi;
