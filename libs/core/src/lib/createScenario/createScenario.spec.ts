import { createMock } from '../createMock/createMock';
import { createScenario } from './createScenario';

const testMockHandlerFn = jest.fn();
testMockHandlerFn.mockReturnValue(['test-mock-return-value']);
const testMock = createMock(
  {
    mockTitle: 'testMock',
    mockOptions: {
      boolean: false,
    },
  },
  testMockHandlerFn
);

const otherMockHandlerFnMock = jest.fn();
otherMockHandlerFnMock.mockReturnValue(['other-mock-return-value']);
const otherMock = createMock(
  {
    mockTitle: 'otherMock',
    mockOptions: {
      otherMockOption: 'option',
    },
  },
  otherMockHandlerFnMock
);

const testScenario = createScenario('test scenario')
  .addMock('testaMockKey', testMock, { boolean: true })
  .addMock('otherMockKey', otherMock, {
    otherMockOption: 'works',
  });

afterEach(() => {
  // testMock.reset();
});
afterEach(() => {
  jest.resetAllMocks();
});

test('createScenario initializes, updates and resets properly', () => {
  // * calls the mock handler function with converted mock options
  expect(testMockHandlerFn).toHaveBeenCalledTimes(2);
  expect(testMockHandlerFn).toHaveBeenLastCalledWith(
    {
      boolean: true,
    },
    // TODO: fixme
    {}
  );
  expect(otherMockHandlerFnMock).toHaveBeenCalledTimes(2);
  expect(otherMockHandlerFnMock).toHaveBeenLastCalledWith(
    {
      otherMockOption: 'works',
    },
    // TODO: fixme
    {}
  );
});
