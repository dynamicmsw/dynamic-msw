import { type AllHandlerTypes, type AnyCreateMockApi } from '@dynamic-msw/core';

export function handlerIsCreateMock(
  handler: AllHandlerTypes,
): handler is AnyCreateMockApi {
  if (typeof handler !== 'object') return false;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return !!(handler as AnyCreateMockApi)?.mockKey;
}
