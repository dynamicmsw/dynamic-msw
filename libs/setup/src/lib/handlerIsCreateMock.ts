import { AllHandlerTypes, CreateMockReturnType } from '@dynamic-msw/core';

export function handlerIsCreateMock(
  handler: AllHandlerTypes
): handler is CreateMockReturnType {
  if (typeof handler !== 'object') return false;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return !!(handler as CreateMockReturnType)?.internals?.isCreateMock;
}
