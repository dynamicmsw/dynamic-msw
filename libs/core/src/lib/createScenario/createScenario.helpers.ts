import type { MocksState } from '../state/state';
import type {
  SetupMocksFn,
  CreateMockOptions,
  OpenPageFn,
} from './createScenario.types';

const initializeMocks: SetupMocksFn = (options, createMockHandler) => {
  const createMockHandlerReturnValue = createMockHandler(options.mockOptions);
  const arrayOfMocks = Array.isArray(createMockHandlerReturnValue)
    ? createMockHandlerReturnValue
    : [createMockHandlerReturnValue];
  return arrayOfMocks;
};

export const initializeManyMocks = ({
  mocksFromState,
  createMockOptions,
}: {
  mocksFromState: MocksState[];
  createMockOptions: CreateMockOptions[];
}) =>
  mocksFromState.flatMap(({ createMockHandler }, index) => {
    const mockOptions = createMockOptions[index];
    const initializedMocks = initializeMocks(mockOptions, createMockHandler);
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
