import { RequestHandler } from 'msw';
import { CreateMockReturnType } from '../createMock/createMock';
import { CreateScenarioReturnType } from '../createScenario/createScenario';

export type AllHandlerTypes =
  | RequestHandler
  | CreateMockReturnType
  | CreateScenarioReturnType;
