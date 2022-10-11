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

const convertMockOptions: ConvertMockOptionsFn = (options) =>
  Object.keys(options).reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: options[curr].selectedValue || options[curr].defaultValue,
    }),
    {} as ConvertedOptions
  );

const setupMocks: SetupMocksFn = (options, mockFn) => {
  const mockFnReturnValue = mockFn(options);
  const arrayOfMocks = Array.isArray(mockFnReturnValue)
    ? mockFnReturnValue
    : [mockFnReturnValue];
  global.__mock_worker?.use(...arrayOfMocks);
  return arrayOfMocks;
};

const getPageUrl = (config: ConvertedOptions, openPage: string | OpenPageFn) =>
  typeof openPage === 'function' ? openPage(config) : openPage;

export const createMock = <T extends Options = Options>(
  {
    mockOptions,
    openPageURL,
    scenarioTitle,
  }: {
    scenarioTitle: string;
    openPageURL?: string | OpenPageFn<T>;
    mockOptions?: T;
  },
  mockFn: CreateMockMockFn<T>
): CreateMockFnReturnType<T> => {
  let convertedConfig = convertMockOptions(mockOptions);

  // pageUrl: getPageUrl(convertedConfig, openPage),
  const returnValue: CreateMockFnReturnType<T> = {
    mocks: setupMocks(convertedConfig, mockFn),
    updateMock: (updateValues: Partial<ConvertedOptions<T>>) => {
      convertedConfig = { ...convertedConfig, ...updateValues };
      returnValue.mocks = setupMocks(convertedConfig, mockFn);
      state.updateMock({
        scenarioTitle,
        mockOptions,
        pageUrl: getPageUrl(convertedConfig, openPageURL),
        updateMock: returnValue.updateMock,
        resetMock: returnValue.resetMock,
      });
    },
    resetMock: () => {
      convertedConfig = convertMockOptions(mockOptions);
      returnValue.mocks = setupMocks(convertedConfig, mockFn);
      state.updateMock({
        scenarioTitle,
        mockOptions,
        pageUrl: getPageUrl(convertedConfig, openPageURL),
        updateMock: returnValue.updateMock,
        resetMock: returnValue.resetMock,
      });
    },
  };

  state.addMock({
    scenarioTitle,
    mockOptions,
    pageUrl: getPageUrl(convertedConfig, openPageURL),
    updateMock: returnValue.updateMock,
    resetMock: returnValue.resetMock,
  });

  return returnValue;
};

export type CreateMockFn = typeof createMock;
