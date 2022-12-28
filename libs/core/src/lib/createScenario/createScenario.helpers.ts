import type {
  CreateMockPrivateReturnType,
  CreateMockReturnType,
} from '../createMock/createMock';
import type {
  ConvertedMockOptionsBase,
  MockData,
  MockOptions,
} from '../createMock/createMock.types';

export const createMockState = <
  TConvertedOptions extends ConvertedMockOptionsBase,
  TMockData extends MockData
>(
  key: string,
  mock: CreateMockReturnType<MockOptions, TMockData>,
  mockOptions: TConvertedOptions,
  mockData: TMockData
) => {
  const defaultConvertedMockOptions = (
    mock as unknown as CreateMockPrivateReturnType
  )._initialConvertedOptions;
  const allMockOptions = { ...defaultConvertedMockOptions, ...mockOptions };
  const initialMockData =
    mockData ||
    (mock as unknown as CreateMockPrivateReturnType)._initialMockData;
  const initializedMockHandlers = (
    mock as unknown as CreateMockPrivateReturnType
  )._createMockHandler(
    allMockOptions,
    // TODO: fixme
    {} as any
  );
  return {
    [key]: {
      mock,
      initialMockOptions: allMockOptions,
      mockOptions: allMockOptions,
      initializedMockHandlers,
      initialMockData,
    },
  };
};
