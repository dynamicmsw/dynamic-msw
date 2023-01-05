import type { TestData } from '../createMock/createMock.test-d';
import { testMock } from '../createMock/createMock.test-d';
import type { CreateScenario } from './createScenario';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createScenario: CreateScenario = () => [] as any;

// ✅ it works when specifying known options with proper value types
createScenario({
  title: 'example',
  mocks: { testMock },
  options: { testMock: { boolean: true } },
  data: { testMock: { testData: ['updated'] } satisfies TestData },
});
// ✅ it works without overriding options
createScenario({
  title: 'example',
  mocks: { testMock },
});

// ❌
createScenario({
  title: 'example',
  mocks: { testMock },
  // @ts-expect-error must be boolean option ❌
  options: { testMock: { boolean: 'true' } },
});

// ❌
createScenario({
  title: 'example',
  mocks: { testMock },
  // @ts-expect-error can not specify unknown keys ❌
  options: { testMock: { unknownKey: true } },
});

// ❌
createScenario({
  title: 'example',
  mocks: { testMock },
  // @ts-expect-error can not specify invalid data ❌
  data: { testMock: { invalid: 'data' } },
});
