import {
  createTestMock,
  createTestMockNoParametersAndNoData,
} from '../configureMock/configureMock.test-d';
import configureScenario from './configureScenario';

export const createTestScenario = configureScenario({
  key: 'testScenario',
  mocks: [createTestMock(), createTestMockNoParametersAndNoData()],
});

const testScenario = createTestScenario();

testScenario.updateParameters({
  testMock: {
    boolean: true,
    //@ts-expect-error not a valid parameter
    notExist: false,
  },
});
testScenario.overrideDefaultParameterValues({
  testMock: {
    boolean: true,
    //@ts-expect-error not a valid parameter
    notExist: false,
  },
});
testScenario.updateParameters satisfies (arg: Record<'testMock', any>) => any;
// @ts-expect-error testKey2 does not exist
testScenario.updateParameters satisfies (arg: Record<'testKey2', any>) => any;

testScenario.overrideDefaultParameterValues satisfies (
  arg: Record<'testMock', any>
) => any;

// @ts-expect-error testKey2 does not have parameters
testScenario.overrideDefaultParameterValues satisfies (
  arg: Record<'testKey2', any>
) => any;

testScenario.overrideDefaultData satisfies (
  arg: Record<'testMock', any>
) => any;

// @ts-expect-error testKey2 not have data
testScenario.overrideDefaultData satisfies (
  arg: Record<'testKey2', any>
) => any;
