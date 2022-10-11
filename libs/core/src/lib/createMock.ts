import type {
  SetupMocksFn,
  ConvertConfigOptionsFn,
  ConvertedConfig,
  Config,
  OpenPageFn,
  CreateMockMockFn,
  CreateMockFnReturnType,
} from './createMock.types';
import { state } from './state';

const convertConfigOptions: ConvertConfigOptionsFn = (config) =>
  Object.keys(config).reduce(
    (prev, curr) => ({ ...prev, [curr]: config[curr].defaultValue }),
    {} as ConvertedConfig
  );

const setupMocks: SetupMocksFn = (options, mockFn) => {
  const mockFnReturnValue = mockFn(options);
  const arrayOfMocks = Array.isArray(mockFnReturnValue)
    ? mockFnReturnValue
    : [mockFnReturnValue];
  global.__mock_worker?.use(...arrayOfMocks);
  return arrayOfMocks;
};

const getPageUrl = (config: ConvertedConfig, openPage: string | OpenPageFn) =>
  typeof openPage === 'function' ? openPage(config) : openPage;

export const createMock = <C extends Config = Config>(
  {
    config,
    openPage,
    id,
  }: {
    id: string;
    openPage?: string | OpenPageFn<C>;
    config?: C;
  },
  mockFn: CreateMockMockFn<C>
): CreateMockFnReturnType<C> => {
  let convertedConfig = convertConfigOptions(config);

  const returnValue = {
    id,
    mocks: setupMocks(convertedConfig, mockFn),
    pageUrl: getPageUrl(convertedConfig, openPage),
    updateMock: (updateValues: Partial<ConvertedConfig<C>>) => {
      convertedConfig = { ...convertedConfig, ...updateValues };
      returnValue.mocks = setupMocks(convertedConfig, mockFn);
      returnValue.pageUrl = getPageUrl(convertedConfig, openPage);

      state.upsertCreateMock(id, {
        convertedConfig,
        updateMock: returnValue.updateMock,
        resetMock: returnValue.resetMock,
        pageUrl: returnValue.pageUrl,
        config,
      });
    },
    resetMock: () => {
      convertedConfig = convertConfigOptions(config);
      returnValue.mocks = setupMocks(convertedConfig, mockFn);
      returnValue.pageUrl = getPageUrl(convertedConfig, openPage);

      state.upsertCreateMock(id, {
        config,
        convertedConfig,
        pageUrl: returnValue.pageUrl,
        updateMock: returnValue.updateMock,
        resetMock: returnValue.resetMock,
      });
    },
  };

  state.upsertCreateMock(id, {
    config,
    convertedConfig,
    pageUrl: returnValue.pageUrl,
    updateMock: returnValue.updateMock,
    resetMock: returnValue.resetMock,
  });
  return returnValue;
};

export type CreateMockFn = typeof createMock;
