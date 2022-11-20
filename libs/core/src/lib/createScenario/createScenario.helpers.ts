import type {
  SetupMocksFn,
  CreateMockOptions,
  OpenPageFn,
  Mocks,
} from './createScenario.types';

const initializeMocks: SetupMocksFn = (options, createMockHandler) => {
  const createMockHandlerReturnValue = createMockHandler(options.mockOptions);
  const arrayOfMocks = Array.isArray(createMockHandlerReturnValue)
    ? createMockHandlerReturnValue
    : [createMockHandlerReturnValue];
  return arrayOfMocks;
};

export const initializeManyMocks = ({
  mocks,
  createMockOptions,
}: {
  mocks: Mocks;
  createMockOptions: CreateMockOptions[];
}) =>
  Object.keys(mocks).flatMap((mockKey, index) => {
    const mockHandler = mocks[mockKey].createMockHandler;
    const mockOptions = createMockOptions[index];
    const initializedMocks = initializeMocks(mockOptions, mockHandler);
    return initializedMocks;
  });

export const getOpenPageURL = (
  openPageURL: string | OpenPageFn<unknown>,
  mockOptions: CreateMockOptions[]
) =>
  typeof openPageURL === 'function'
    ? openPageURL(
        mockOptions.reduce(
          (prev, { mockTitle, mockOptions }) => ({
            ...prev,
            [mockTitle]: mockOptions,
          }),
          {}
        )
      )
    : openPageURL;
