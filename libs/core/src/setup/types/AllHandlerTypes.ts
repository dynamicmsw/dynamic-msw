import { type RequestHandler } from 'msw';
import { type AnyCreateMockPublicApi } from '../../configureMock/types/AnyCreateMockApi';
import { type AnyCreateMockApi } from '../../configureMock/types/AnyCreateMockApi';
import { type AnyCreateScenarioApi } from '../../configureScenario/types/AnyCreateScenarioApi';
import { type AnyCreateScenarioPublicApi } from '../../configureScenario/types/AnyCreateScenarioApi';
import { type WebSocketHandler } from 'msw/lib/core/handlers/WebSocketHandler';

export type AllPublicHandlerTypes =
  | RequestHandler
  | WebSocketHandler
  | AnyCreateMockPublicApi
  | AnyCreateScenarioPublicApi;

export type AllHandlerTypes =
  | RequestHandler
  | WebSocketHandler
  | AnyCreateMockApi
  | AnyCreateScenarioApi;
