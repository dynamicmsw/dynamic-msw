import type {
  SetupMocksFn,
  ConvertMockOptionsFn,
  ConvertedOptions,
  Options,
  StateOptions,
  OpenPageFn,
  CreateMockMockFn,
  CreateMockFnReturnType,
  OptionType,
  ConvertedStateOptions,
} from './createMock.types';
import { state } from './state';

export const getActiveOptions: ConvertMockOptionsFn = (options) =>
  Object.keys(options).reduce(
    (prev, curr) => ({
      ...prev,
      [curr]:
        typeof options[curr].selectedValue !== 'undefined'
          ? options[curr].selectedValue
          : options[curr].defaultValue,
    }),
    {} as ConvertedStateOptions
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
  options: StateOptions,
  updateObject: ConvertedOptions
): StateOptions =>
  Object.keys(options).reduce(
    (prev, optionKey) => ({
      ...prev,
      [optionKey]: {
        ...options[optionKey],
        // TODO: perhaps this type cast can be removed
        selectedValue: updateObject[optionKey] as OptionType,
      },
    }),
    options
  );

const getPageURL = (
  config: ConvertedOptions,
  openPageURL: string | OpenPageFn
) => (typeof openPageURL === 'function' ? openPageURL(config) : openPageURL);

const convertMockOptionsToState = (options: Options): StateOptions =>
  (Object.keys(options) as Array<keyof Options>).reduce((prev, optionKey) => {
    const option = options[optionKey];
    return {
      ...prev,
      [optionKey]: {
        ...(typeof option === 'object' ? option : {}),
        defaultValue: typeof option === 'object' ? option.defaultValue : option,
      },
    };
  }, {});

export const createMock = <T extends Options = Options>(
  {
    mockOptions,
    openPageURL,
    mockTitle,
  }: {
    mockTitle: string;
    openPageURL?: string | OpenPageFn<ConvertedOptions<T>>;
    mockOptions?: T;
  },
  mockFn: CreateMockMockFn<T>
): CreateMockFnReturnType<T> => {
  const intialMockState = state
    .getState()
    .mocks.find((stateData) => stateData.mockTitle === mockTitle);

  const convertedMockOptionsToState = convertMockOptionsToState(mockOptions);

  let activeOptions = getActiveOptions(
    intialMockState?.mockOptions || convertedMockOptionsToState
  );

  const returnValue: CreateMockFnReturnType<T> = {
    mocks: initializeMocks(activeOptions, mockFn),
    mockTitle,
    updateMock: (updateObject) => {
      activeOptions = { ...activeOptions, ...updateObject };
      // TODO: is mutating an returned object an anti pattern? Something tells me it might be buggy
      returnValue.mocks = initializeMocks(activeOptions, mockFn);
      state.updateMock({
        mockTitle,
        mockOptions: updateMockOptions(
          convertedMockOptionsToState,
          updateObject
        ),
        openPageURL: getPageURL(activeOptions, openPageURL),
        updateMock: returnValue.updateMock,
        resetMock: returnValue.resetMock,
        mockFn,
      });
      return returnValue;
    },
    resetMock: () => {
      activeOptions = getActiveOptions(convertedMockOptionsToState);
      returnValue.mocks = initializeMocks(activeOptions, mockFn);
      state.updateMock({
        mockTitle,
        mockOptions: convertedMockOptionsToState,
        openPageURL: getPageURL(activeOptions, openPageURL),
        updateMock: returnValue.updateMock,
        resetMock: returnValue.resetMock,
        mockFn,
      });
      return returnValue;
    },
  };

  state.addMock({
    mockTitle,
    mockOptions: convertedMockOptionsToState,
    openPageURL: getPageURL(activeOptions, openPageURL),
    updateMock: returnValue.updateMock,
    resetMock: returnValue.resetMock,
    mockFn,
  });

  return returnValue;
};

export type CreateMockFn = typeof createMock;
