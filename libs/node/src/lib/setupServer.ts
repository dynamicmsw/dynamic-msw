import SetupServerApi from './SetupServerApi';
import { AllPublicHandlerTypes } from '@dynamic-msw/core';

export default function setupServer(...handlers: AllPublicHandlerTypes[]) {
  return new SetupServerApi(handlers);
}
