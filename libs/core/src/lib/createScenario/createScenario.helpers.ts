import type {
  SetupMocksFn,
  CreateMockOptions,
  OpenPageFn,
  Mocks,
} from './createScenario.types';

const initializeMocks: SetupMocksFn = (
  options,
  createMockHandler,
  mockData,
  context
) => {
  const createMockHandlerReturnValue = createMockHandler(
    options.mockOptions,
    mockData,
    context
  );
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
    const mockData = mocks[mockKey].mockData;
    const updateMockData = mocks[mockKey].updateMockData;
    const mockOptions = createMockOptions[index];
    const initializedMocks = initializeMocks(
      mockOptions,
      mockHandler,
      mockData,
      { updateMockData }
    );
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
