import { RequestHandler } from 'msw';
import SetupServerApi from './SetupServerApi';
import {
  CreateMockReturnType,
  CreateScenarioReturnType,
} from '@dynamic-msw/core';

export default function setupServer(
  ...handlers: Array<
    RequestHandler | CreateMockReturnType | CreateScenarioReturnType
  >
) {
  return new SetupServerApi(handlers);
}
