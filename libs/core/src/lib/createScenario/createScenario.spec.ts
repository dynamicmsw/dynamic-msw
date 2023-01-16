import type { CreateMockPrivateReturnType } from '../createMock/createMock';
import { createMock } from '../createMock/createMock';
import { createStorageKey } from '../createMock/createMock.helpers';
import type {
  ConvertedMockOptions,
  MockOptions,
  OpenPageUrlFn,
  StoredMockState,
} from '../createMock/createMock.types';
import { createScenario } from './createScenario';
import { createScenarioMockKey } from './createScenario.helpers';

export const mockTitle = 'test mock title';
const scenarioTitle = 'scenario title';
const scenarioKey = createScenarioMockKey(scenarioTitle, mockTitle);

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
  string: 'updated',
  number: 0,
  boolean: false,
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
  title: scenarioKey,
  openPageURL: openPageURLFn.toString(),
  options: {
    string: { inputType: 'string', defaultValue: 'updated' },
    number: { inputType: 'number', defaultValue: 0 },
    boolean: { inputType: 'boolean', defaultValue: false },
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
  title: mockTitle,
  options,
  openPageURL: openPageURLFn,
};

export const mockHandlerFnMock = jest.fn();
mockHandlerFnMock.mockReturnValue(['test']);

export const testMock = createMock(createMockOptions, mockHandlerFnMock);

const workerMock = { use: jest.fn(), resetHandlers: jest.fn() };

(testMock as unknown as CreateMockPrivateReturnType)._setServerOrWorker(
  workerMock as unknown as Parameters<
    CreateMockPrivateReturnType['_setServerOrWorker']
  >[0]
);

const mockKey = createStorageKey(scenarioKey);

const testScenario = createScenario({
  title: scenarioTitle,
  mocks: { testMock },
  options: { testMock: { string: 'updated', boolean: false, number: 0 } },
});

(testScenario as unknown as CreateMockPrivateReturnType)._setServerOrWorker(
  workerMock as unknown as Parameters<
    CreateMockPrivateReturnType['_setServerOrWorker']
  >[0]
);

testScenario.activate();

afterEach(() => {
  testScenario.reset();
  jest.resetAllMocks();
});
beforeAll(() => {
  jest.useFakeTimers();
});
afterAll(() => {
  jest.useRealTimers();
});

test('should initialize new createMocks with updated storage key', () => {
  // * calls the mock handler function with converted mock options
  expect(mockHandlerFnMock).toHaveBeenCalledTimes(2);
  expect(mockHandlerFnMock).toHaveBeenLastCalledWith(convertedMockOptions, {
    updateOptions: expect.any(Function),
    updateData: expect.any(Function),
  });
  // * saves to local storage properly
  expect(JSON.parse(localStorage.getItem(mockKey) || '{}')).toEqual(
    storedMockData
  );

  // * updates properly
  testScenario.updateOptions({ testMock: { boolean: true } });
  expect(JSON.parse(localStorage.getItem(mockKey) || '{}')).toEqual({
    ...storedMockData,
    options: {
      ...storedMockData.options,
      boolean: {
        inputType: 'boolean',
        defaultValue: false,
        selectedValue: true,
      },
    },
  });
  expect(workerMock.use).toBeCalledTimes(2);
  expect(workerMock.use).toHaveBeenCalledWith('test');
  expect(mockHandlerFnMock).toHaveBeenCalledTimes(3);
  expect(mockHandlerFnMock).toHaveBeenLastCalledWith(
    {
      ...convertedMockOptions,
      boolean: true,
    },
    {
      updateOptions: expect.any(Function),
      updateData: expect.any(Function),
    }
  );

  // * resets properly
  testScenario.reset();
  expect(JSON.parse(localStorage.getItem(mockKey) || '{}')).toEqual(
    storedMockData
  );
  expect(workerMock.use).toHaveBeenCalledTimes(3);
});
