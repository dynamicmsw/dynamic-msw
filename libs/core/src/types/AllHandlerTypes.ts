import { RequestHandler } from 'msw';
import { AnyCreateMockReturnType } from '../createMock/createMock';
import { CreateScenarioReturnType } from '../createScenario/createScenario';

export type AllHandlerTypes =
  | RequestHandler
  | AnyCreateMockReturnType
  | CreateScenarioReturnType;
