import {
  createTestMock,
  createTestMockNoParametersAndNoData,
} from '../configureMock/configureMock.test-d';
import configureScenario from './configureScenario';

export const createTestScenario = configureScenario({
  key: 'testScenario',
  mocks: [createTestMock(), createTestMockNoParametersAndNoData()],
});

const testScenario = createTestScenario({
  data: { testMock: { test: '' } },
  parameters: {
    testMock: {
      number: 2,
    },
  },
});

testScenario.updateParameters({
  testMock: {
    boolean: true,
    //@ts-expect-error not a valid parameter
    notExist: false,
  },
});

createTestScenario({
  data: { testMock: { test: '' } },
  parameters: {
    testMock: {
      //@ts-expect-error not a valid parameter
      notExist: 'string',
    },
  },
});
createTestScenario({
  data: { testMock: { test: '' } },
  parameters: {
    //@ts-expect-error not a valid mock key
    notExist: {
      notExist: 'string',
    },
  },
});

testScenario.updateParameters satisfies (arg: Record<'testMock', any>) => any;
// @ts-expect-error testKey2 does not exist
testScenario.updateParameters satisfies (arg: Record<'testKey2', any>) => any;
createTestScenario({
  // @ts-expect-error invalid update type
  data: { testMock: { test: 1 } },
});
