import { createMock } from './createMock';
import { createStorageKey } from './createMock.helpers';
import type {
  ConvertedMockOptions,
  MockOptions,
  OpenPageUrlFn,
  StoredMockState,
} from './createMock.types';

const mockTitle = 'test mock title';

const mockOptions = {
  string: 'tanga',
  number: 1337,
  boolean: true,
  options: ['tanga', 'alpha', 'beta'] as const,
  variableOptions: ['tanga', 0, true] as const,
  objOptions: { options: ['tanga', 0, true] as const },
  objOptionsWithDefaultValue: {
    options: ['tanga', 0, true] as const,
    defaultValue: 'tanga',
  },
  objTypeString: { inputType: 'string' },
  objTypeNumber: { inputType: 'number' },
  objTypeBoolean: { inputType: 'boolean' },
  objTypeOptions: {
    inputType: 'string',
    options: ['tanga', 0, true] as const,
  },
  objTypeStringDefaultValue: {
    inputType: 'string',
    defaultValue: 'asdf',
  },
} satisfies MockOptions;

const convertedMockOptions = {
  string: 'tanga',
  number: 1337,
  boolean: true,
  options: undefined,
  variableOptions: undefined,
  objOptions: undefined,
  objOptionsWithDefaultValue: 'tanga',
  objTypeString: undefined,
  objTypeNumber: undefined,
  objTypeBoolean: undefined,
  objTypeOptions: undefined,
  objTypeStringDefaultValue: 'asdf',
} satisfies ConvertedMockOptions<typeof mockOptions>;

const openPageURLFn: OpenPageUrlFn<typeof mockOptions> = (x) => `${x.string}`;

const storedCreateMockData = {
  mockTitle: mockTitle,
  openPageURL: openPageURLFn.toString(),
  mockOptions: {
    string: { inputType: 'string', defaultValue: 'tanga' },
    number: { inputType: 'number', defaultValue: 1337 },
    boolean: { inputType: 'boolean', defaultValue: true },
    options: {
      inputType: 'select',
      options: ['tanga', 'alpha', 'beta'] as const,
    },
    variableOptions: {
      inputType: 'select',
      options: ['tanga', 0, true] as const,
    },
    objOptions: { inputType: 'select', options: ['tanga', 0, true] as const },
    objOptionsWithDefaultValue: {
      inputType: 'select',
      options: ['tanga', 0, true] as const,
      defaultValue: 'tanga',
    },
    objTypeString: { inputType: 'string' },
    objTypeNumber: { inputType: 'number' },
    objTypeBoolean: { inputType: 'boolean' },
    objTypeOptions: {
      inputType: 'select',
      options: ['tanga', 0, true] as const,
    },
    objTypeStringDefaultValue: {
      inputType: 'string',
      defaultValue: 'asdf',
    },
  },
} satisfies StoredMockState<typeof mockOptions>;

const createMockOptions = {
  mockTitle,
  mockOptions,
  openPageURL: openPageURLFn,
};

const mockKey = createStorageKey(mockTitle);

const mockHandlerFnMock = jest.fn();
mockHandlerFnMock.mockReturnValue(['test']);

const testMock = createMock(createMockOptions, mockHandlerFnMock);

const workerMock = { use: jest.fn(), resetHandlers: jest.fn() };

// @ts-expect-error the method is private as it's only used internally
testMock._setServerOrWorker(workerMock);

afterEach(() => {
  testMock.reset();
});
afterEach(() => {
  jest.resetAllMocks();
});

test('createMock initializes, updates and resets properly', () => {
  // * calls the mock handler function with converted mock options
  expect(mockHandlerFnMock).toHaveBeenCalledTimes(1);
  expect(mockHandlerFnMock).toHaveBeenCalledWith(convertedMockOptions);

  // * saves to local storage properly
  expect(JSON.parse(localStorage.getItem(mockKey) || '{}')).toEqual(
    storedCreateMockData
  );

  // * updates properly
  testMock.update({ boolean: false });
  expect(JSON.parse(localStorage.getItem(mockKey) || '{}')).toEqual({
    ...storedCreateMockData,
    mockOptions: {
      ...storedCreateMockData.mockOptions,
      boolean: {
        inputType: 'boolean',
        defaultValue: true,
        selectedValue: false,
      },
    },
  });
  expect(workerMock.use).toBeCalledTimes(1);
  expect(workerMock.use).toHaveBeenCalledWith('test');
  expect(mockHandlerFnMock).toHaveBeenCalledTimes(2);
  expect(mockHandlerFnMock).toHaveBeenLastCalledWith({
    ...convertedMockOptions,
    boolean: false,
  });

  // * resets properly
  testMock.reset();
  expect(JSON.parse(localStorage.getItem(mockKey) || '{}')).toEqual(
    storedCreateMockData
  );
  expect(workerMock.resetHandlers).toHaveBeenCalledTimes(1);
});
