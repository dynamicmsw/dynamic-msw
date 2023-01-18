import type { CreateMock } from './createMock';

const createMock: CreateMock = () => ({} as any);
const testData = {
  testData: ['hello', 'darkness', 'my', 'old', 'friend'],
  otherData: 'x',
};
export type TestData = typeof testData;

// ✅ converts proper type from options in openPageURL and
// the mock handler fn
export const testMock = createMock(
  {
    title: 'valid',
    options: {
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
        defaultValue: 1,
      },
    },
    data: testData,
    openPageURL(o) {
      o.string satisfies string;
      o.number satisfies number;
      o.boolean satisfies boolean;
      o.options satisfies 'tanga' | 'alpha' | 'beta' | undefined;
      o.variableOptions satisfies 'tanga' | 0 | true | undefined;
      o.objOptions satisfies 'tanga' | 0 | true | undefined;
      o.objOptions satisfies 'tanga' | 0 | true | undefined;
      o.objOptionsWithDefaultValue satisfies 'tanga' | 0 | true;
      o.objTypeString satisfies string | undefined;
      o.objTypeNumber satisfies number | undefined;
      o.objTypeBoolean satisfies boolean | undefined;
      o.objTypeOptions satisfies 'tanga' | 0 | true | undefined;
      o.objTypeStringDefaultValue satisfies string;
      return 'valid';
    },
  },
  (o, { data }) => {
    o.string satisfies string;
    o.number satisfies number;
    o.boolean satisfies boolean;
    o.options satisfies 'tanga' | 'alpha' | 'beta' | undefined;
    o.variableOptions satisfies 'tanga' | 0 | true | undefined;
    o.objOptions satisfies 'tanga' | 0 | true | undefined;
    o.objOptionsWithDefaultValue satisfies 'tanga' | 0 | true;
    o.objTypeString satisfies string | undefined;
    o.objTypeNumber satisfies number | undefined;
    o.objTypeBoolean satisfies boolean | undefined;
    o.objTypeOptions satisfies 'tanga' | 0 | true | undefined;
    o.objTypeStringDefaultValue satisfies string;
    data satisfies typeof testData;
    return [];
  }
);

// ✅ no error with proper update options
testMock.updateOptions({
  options: 'alpha',
  boolean: false,
  number: 12,
  objOptions: 0,
  objOptionsWithDefaultValue: true,
});

// ✅ passes proper data type to function and no error when
// using correct data or a function that returns correct data
testMock.updateData({ testData: ['updates'] });
// testMock.updateData((data) => {
//   data satisfies typeof testData;
//   return { testData: ['updates from function'] };
// });

// ✅ no errors when not specifying mockData
createMock({ title: 'no default data mock', options: {} }, () => []);

// ❌
createMock(
  {
    title: 'invalid 1',
    options: {
      // @ts-expect-error can't be empty object ❌
      emptyObj: {},
    },
  },
  () => []
);

// ❌
createMock(
  {
    title: 'invalid 2',
    options: {
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
    },
  },
  (o) => {
    // @ts-expect-error should have undefined in the union type ❌
    o.options satisfies 'tanga' | 'alpha' | 'beta';
    // @ts-expect-error should have undefined in the union type ❌
    o.variableOptions satisfies 'tanga' | 0 | true;
    // @ts-expect-error should have undefined in the union type ❌
    o.objOptions satisfies 'tanga' | 0 | true;
    // @ts-expect-error should have undefined in the union type ❌
    o.objTypeString satisfies string;
    // @ts-expect-error should have undefined in the union type ❌
    o.objTypeNumber satisfies number;
    // @ts-expect-error should have undefined in the union type ❌
    o.objTypeBoolean satisfies boolean;
    // @ts-expect-error should have undefined in the union type ❌
    o.objTypeOptions satisfies 'tanga' | 0 | true;
    return [];
  }
);

// ❌
createMock(
  {
    title: 'invalid 3',
    options: {},
  },
  // @ts-expect-error must return MSW handler array ❌
  () => {
    return [null];
  }
);

// ❌
testMock.updateOptions({
  // @ts-expect-error invalid value type
  options: 'invalid',
  // @ts-expect-error invalid value type
  boolean: 'invalid',
  // @ts-expect-error invalid value type
  number: 'invalid',
  // @ts-expect-error invalid value type
  objOptions: 'invalid',
  // @ts-expect-error invalid value type
  objOptionsWithDefaultValue: 'invalid',
});

// ❌
// @ts-expect-error incomplete data
testMock.updateData<TestData>({});
