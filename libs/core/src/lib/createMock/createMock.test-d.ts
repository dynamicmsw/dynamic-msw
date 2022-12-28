import type { CreateMock } from './createMock';

const createMock: CreateMock = () => ({} as any);

// ✅
const testMock = createMock(
  {
    mockTitle: 'valid',
    mockOptions: {
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
  (o) => {
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
    return [];
  }
);

// ✅
testMock.update({
  options: 'alpha',
  boolean: false,
  number: 12,
  objOptions: 0,
  objOptionsWithDefaultValue: true,
});

// ❌
createMock(
  {
    mockTitle: 'invalid 1',
    mockOptions: {
      // @ts-expect-error can't be empty object ❌
      emptyObj: {},
    },
  },

  () => []
);

// ❌
createMock(
  {
    mockTitle: 'invalid 2',
    mockOptions: {
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
    mockTitle: 'invalid 3',
    mockOptions: {},
  },
  // @ts-expect-error must return MSW handler array ❌
  () => {
    return [null];
  }
);

// ❌
testMock.update({
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
