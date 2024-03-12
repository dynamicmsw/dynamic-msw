import { type AnyCreateMockApi } from '../configureMock/types/AnyCreateMockApi';
import { type AllHandlerTypes } from './types/AllHandlerTypes';

export function isDynamicMockHandler(
  handler: AllHandlerTypes,
): handler is AnyCreateMockApi {
  if (typeof handler !== 'object') return false;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return !!(handler as AnyCreateMockApi)?.mockKey;
}
