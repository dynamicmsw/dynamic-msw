import { RequestHandler } from 'msw';
import { AnyCreateMockReturnType } from '../configureMock/configureMock';
import { CreateScenarioReturnType } from '../configureScenario/configureScenario';

export type AllHandlerTypes =
  | RequestHandler
  | AnyCreateMockReturnType
  | CreateScenarioReturnType;
