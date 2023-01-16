import type { CreateMockPrivateReturnType } from './createMock';
import { createMock } from './createMock';
import { createStorageKey } from './createMock.helpers';
import type {
  ConvertedMockOptions,
  MockData,
  MockOptions,
  OpenPageUrlFn,
  StoredMockState,
} from './createMock.types';

export const title = 'test mock title';

export const options = {
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

export const convertedMockOptions = {
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
} satisfies ConvertedMockOptions<typeof options>;

const openPageURLFn: OpenPageUrlFn<typeof options> = (x) => `${x.string}`;

const storedMockData = {
  title: title,
  openPageURL: openPageURLFn.toString(),
  options: {
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
} satisfies StoredMockState<typeof options>;

const createMockOptions = {
  title,
  options,
  openPageURL: openPageURLFn,
};

const mockKey = createStorageKey(title);

export const mockHandlerFnMock = jest.fn();
mockHandlerFnMock.mockReturnValue(['test']);

export const testMock = createMock(createMockOptions, mockHandlerFnMock);

const workerMock = { use: jest.fn(), resetHandlers: jest.fn() };

(testMock as unknown as CreateMockPrivateReturnType)._setServerOrWorker(
  workerMock as unknown as Parameters<
    CreateMockPrivateReturnType['_setServerOrWorker']
  >[0]
);

testMock.activate();

afterEach(() => {
  testMock.reset();
  jest.resetAllMocks();
});
beforeAll(() => {
  jest.useFakeTimers();
});
afterAll(() => {
  jest.useRealTimers();
});

test('createMock initializes, updates and resets properly', () => {
  // * calls the mock handler function with converted mock options
  expect(mockHandlerFnMock).toHaveBeenCalledTimes(1);
  expect(mockHandlerFnMock).toHaveBeenCalledWith(convertedMockOptions, {
    updateOptions: expect.any(Function),
    updateData: expect.any(Function),
  });

  // * saves to local storage properly
  expect(JSON.parse(localStorage.getItem(mockKey) || '{}')).toEqual(
    storedMockData
  );

  // * updates properly
  testMock.updateOptions({ boolean: false });
  expect(JSON.parse(localStorage.getItem(mockKey) || '{}')).toEqual({
    ...storedMockData,
    options: {
      ...storedMockData.options,
      boolean: {
        inputType: 'boolean',
        defaultValue: true,
        selectedValue: false,
      },
    },
  });
  expect(workerMock.use).toBeCalledTimes(2);
  expect(workerMock.use).toHaveBeenCalledWith('test');
  expect(mockHandlerFnMock).toHaveBeenCalledTimes(2);
  expect(mockHandlerFnMock).toHaveBeenLastCalledWith(
    {
      ...convertedMockOptions,
      boolean: false,
    },
    {
      updateOptions: expect.any(Function),
      updateData: expect.any(Function),
    }
  );

  // * resets properly
  testMock.reset();
  expect(JSON.parse(localStorage.getItem(mockKey) || '{}')).toEqual(
    storedMockData
  );
  expect(workerMock.use).toHaveBeenCalledTimes(3);
});

const defaultMockData = { test: ['default'] };
const updatedMockData = { test: ['updated'] };

const testDataMock = jest.fn();
test('createMock updates data and options from context properly', () => {
  const contextMock = createMock(
    {
      title: 'context test mock',
      options: {
        boolean: true,
      },
      data: defaultMockData,
    },
    ({ boolean }, { updateOptions, updateData, data }) => {
      setTimeout(() => {
        if (boolean) {
          updateOptions({ boolean: false });
          setTimeout(() => {
            updateData(updatedMockData);
          }, 2);
        }
        testDataMock({ data, boolean });
      }, 2);
      return [];
    }
  );
  (contextMock as unknown as CreateMockPrivateReturnType)._setServerOrWorker(
    workerMock as unknown as Parameters<
      CreateMockPrivateReturnType['_setServerOrWorker']
    >[0]
  );
  jest.advanceTimersByTime(3);
  expect(testDataMock).toHaveBeenCalledWith({
    data: defaultMockData,
    boolean: true,
  });
  jest.advanceTimersByTime(2);
  expect(testDataMock).toHaveBeenLastCalledWith({
    data: defaultMockData,
    boolean: false,
  });
  jest.advanceTimersByTime(4);
  expect(testDataMock).toHaveBeenLastCalledWith({
    data: updatedMockData,
    boolean: false,
  });
});
