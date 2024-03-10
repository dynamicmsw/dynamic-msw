import SetupServerApi from './SetupServerApi';
import { type AllPublicHandlerTypes } from '@dynamic-msw/core';

export default function setupServer(...handlers: AllPublicHandlerTypes[]) {
  return new SetupServerApi(handlers);
}
