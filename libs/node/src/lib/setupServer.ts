import { RequestHandler } from 'msw';
import SetupServerApi from './SetupServerApi';
import {
  AnyCreateMockReturnType,
  CreateScenarioReturnType,
} from '@dynamic-msw/core';

export default function setupServer(
  ...handlers: Array<
    RequestHandler | AnyCreateMockReturnType | CreateScenarioReturnType
  >
) {
  return new SetupServerApi(handlers);
}
