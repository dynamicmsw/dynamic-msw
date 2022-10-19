import type {
  SetupMocksFn,
  ConvertMockOptionsFn,
  ConvertedOptions,
  Options,
  OpenPageFn,
  CreateMockMockFn,
  CreateMockFnReturnType,
} from './createMock.types';
import { state } from './state';

export const convertMockOptions: ConvertMockOptionsFn = (options) =>
  Object.keys(options).reduce(
    (prev, curr) => ({
      ...prev,
      [curr]:
        typeof options[curr].selectedValue !== 'undefined'
          ? options[curr].selectedValue
          : options[curr].defaultValue,
    }),
    {} as ConvertedOptions
  );

export const initializeMocks: SetupMocksFn = (options, mockFn) => {
  const mockFnReturnValue = mockFn(options);
  const arrayOfMocks = Array.isArray(mockFnReturnValue)
    ? mockFnReturnValue
    : [mockFnReturnValue];
  global.__mock_worker?.use(...arrayOfMocks);
  return arrayOfMocks;
};

const updateMockOptions = (
  options: Options,
  updatedOptions: Partial<ConvertedOptions>
) =>
  Object.keys(updatedOptions).reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: {
        ...options[curr],
        selectedValue: updatedOptions[curr],
      },
    }),
    options
  );

const getPageURL = (
  config: ConvertedOptions,
  openPageURL: string | OpenPageFn
) => (typeof openPageURL === 'function' ? openPageURL(config) : openPageURL);

export const createMock = <T extends Options = Options>(
  {
    mockOptions,
    openPageURL,
    mockTitle,
  }: {
    mockTitle: string;
    openPageURL?: string | OpenPageFn<T>;
    mockOptions?: T;
  },
  mockFn: CreateMockMockFn<T>
): CreateMockFnReturnType<T> => {
  const initialState = state
    .getState()
    .mocks.find((stateData) => stateData.mockTitle === mockTitle);

  const createMockBaseArgs = {
    mockFn,
    openPageURL,
  };

  let convertedConfig = convertMockOptions(
    initialState?.mockOptions || mockOptions
  );

  const returnValue: CreateMockFnReturnType<T> = {
    mocks: initializeMocks(convertedConfig, mockFn),
    mockTitle,
    updateMock: (updateValues) => {
      convertedConfig = { ...convertedConfig, ...updateValues };
      // TODO: is mutating an returned object an anti pattern? Something tells me it might be buggy
      returnValue.mocks = initializeMocks(convertedConfig, mockFn);
      state.updateMock({
        mockTitle,
        mockOptions: updateMockOptions(mockOptions, updateValues),
        openPageURL: getPageURL(convertedConfig, openPageURL),
        updateMock: returnValue.updateMock,
        resetMock: returnValue.resetMock,
        createMockBaseArgs,
      });
      return returnValue;
    },
    resetMock: () => {
      convertedConfig = convertMockOptions(mockOptions);
      returnValue.mocks = initializeMocks(convertedConfig, mockFn);
      state.updateMock({
        mockTitle,
        mockOptions,
        openPageURL: getPageURL(convertedConfig, openPageURL),
        updateMock: returnValue.updateMock,
        resetMock: returnValue.resetMock,
        createMockBaseArgs,
      });
    },
  };

  state.addMock({
    mockTitle,
    mockOptions,
    openPageURL: getPageURL(convertedConfig, openPageURL),
    updateMock: returnValue.updateMock,
    resetMock: returnValue.resetMock,
    createMockBaseArgs,
  });

  return returnValue;
};

export type CreateMockFn = typeof createMock;
