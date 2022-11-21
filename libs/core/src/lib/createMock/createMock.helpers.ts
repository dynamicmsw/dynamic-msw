import type {
  SetupMocksFn,
  ConvertMockOptionsFn,
  ConvertedOptions,
  Options,
  StateOptions,
  OpenPageFn,
  OptionType,
  ConvertedStateOptions,
} from './createMock.types';

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

export const initializeMocks: SetupMocksFn = (options, createMockHandler) => {
  const createMockHandlerReturnValue = createMockHandler(options);
  const arrayOfMocks = Array.isArray(createMockHandlerReturnValue)
    ? createMockHandlerReturnValue
    : [createMockHandlerReturnValue];
  return arrayOfMocks;
};

export const updateMockOptions = (
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

export const getPageURL = (
  config: ConvertedOptions,
  openPageURL: string | OpenPageFn
) => (typeof openPageURL === 'function' ? openPageURL(config) : openPageURL);

export const convertMockOptionsToState = (
  options: Options,
  activeOptoins: ConvertedOptions
): StateOptions =>
  (Object.keys(options) as Array<keyof Options>).reduce((prev, optionKey) => {
    const option = options[optionKey];
    const isObject = typeof option === 'object' && !Array.isArray(option);
    const defaultValue = isObject
      ? //TODO: type defs got nasty so it needs some refactoring
        (option as { defaultValue?: unknown }).defaultValue
      : Array.isArray(option)
      ? undefined
      : option;
    const selectedValue = activeOptoins?.[optionKey];
    return {
      ...prev,
      [optionKey]: {
        ...(isObject ? option : {}),
        ...(Array.isArray(option) ? { options: option } : {}),
        defaultValue,
        selectedValue:
          selectedValue === defaultValue ? undefined : selectedValue,
      },
    };
  }, {});
