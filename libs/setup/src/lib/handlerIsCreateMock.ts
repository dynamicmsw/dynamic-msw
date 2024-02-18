import { AllHandlerTypes, AnyCreateMockReturnType } from '@dynamic-msw/core';

export function handlerIsCreateMock(
  handler: AllHandlerTypes
): handler is AnyCreateMockReturnType {
  if (typeof handler !== 'object') return false;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return !!(handler as AnyCreateMockReturnType)?.internals?.isCreateMock;
}
