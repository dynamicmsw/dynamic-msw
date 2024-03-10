import { type CreateMockReturnValueMap } from '../types/CreateMockReturnValueMap';

export default function resetAllCreateMocks(
  dynamicHandlerInternalsMap: CreateMockReturnValueMap,
) {
  Object.values(dynamicHandlerInternalsMap).forEach((createMock) => {
    createMock.reset();
  });
}
