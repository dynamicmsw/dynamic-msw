import { createMock } from '../createMock/createMock';
import { testMock } from '../createMock/createMock.test-d';
import type { CreateScenario } from './createScenario';

const createScenario: CreateScenario = () => ({} as any);

export const otherMock = createMock(
  {
    mockTitle: 'otherMock',
    mockOptions: {
      otherMockOption: 'option',
    },
    data: { test: ['default'] },
  },
  () => {
    return [];
  }
);

// ✅
const testScenario = createScenario('test scenario')
  .addMock('testMockKey', testMock, {
    boolean: false,
  })
  .addMock(
    'otherMockKey',
    otherMock,
    {
      otherMockOption: 'works',
    },
    {
      test: ['updates'],
    }
  );

// ✅
testScenario.updateOptions({
  testMockKey: { boolean: false, objOptions: true },
  otherMockKey: { otherMockOption: 'tanga' },
});

// ❌
createScenario('invalid scenario')
  .addMock('testMockKey', testMock, {
    // @ts-expect-error should inherit mock option types
    boolean: 'not boolean',
  })
  .addMock('otherMockKey', otherMock, {
    // @ts-expect-error should inherit mock option types
    otherMockOption: true,
  });

// ❌
// @ts-expect-error invalid mock key
testScenario.updateOptions({ invalidKey: { otherMockOption: '' } });
// ❌
testScenario.updateOptions({
  testMockKey: { boolean: true },
  otherMockKey: {
    // @ts-expect-error invalid mock option value
    otherMockOption: true,
  },
});
// ❌
// @ts-expect-error invalid mock option value
testScenario.updateOptions({ testMockKey: { boolean: 'invalid value' } });
