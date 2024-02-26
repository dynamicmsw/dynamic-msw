import configureMock from './configureMock';

export const createTestMock = configureMock(
  {
    key: 'testMock',
    parameters: {
      string: 'test-string',
      number: 1,
      boolean: true,
      nullableStringWithoutDefault: {
        dashboardInputType: 'string',
        nullable: true,
      },
      stringWithInputTypeAndDefaultValue: {
        dashboardInputType: 'string',
        defaultValue: 'test-string',
      },
      select: {
        selectOptions: ['a', 'b'] as const,
        // ! default value is not strictly typed
        defaultValue: 'd',
      },
    },
    data: { test: 'x' },
  },
  (parameters) => {
    parameters.string satisfies string | number;
    parameters.number satisfies number;
    parameters.boolean satisfies boolean;
    // parameters.nullableStringWithoutDefault satisfies string | null;
    parameters.stringWithInputTypeAndDefaultValue satisfies string | null;

    // TODO add no unused lint rules warning
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (parameters.stringWithInputTypeAndDefaultValue === null) {
      //
    }

    //@ts-expect-error can't be null
    parameters.boolean satisfies null;
    //@ts-expect-error does not exist
    parameters.dontExist satisfies unknown;
    // @ts-expect-error 'e' is not an possible value of the select array
    parameters.select satisfies 'e';
    return [];
  }
);
configureMock(
  {
    key: 'testMockNoParametersAndData',
    data: { some: 'data' },
  },
  (parameters, data, updateData) => {
    data satisfies { some: string };
    updateData satisfies (update: { some: string }) => void;
    parameters satisfies undefined;
    return [];
  }
);
export const createTestMockNoParametersAndNoData = configureMock(
  {
    key: 'testMockParametersAndNoData',
  },
  // @ts-expect-error parameters is never
  (_parameters) => {
    return [];
  }
);
configureMock(
  {
    key: 'testMockParametersAndData',
    data: { some: 'data' },
  },
  (parameters, data, updateData) => {
    data satisfies { some: string };
    updateData satisfies (update: { some: string }) => void;
    parameters satisfies undefined;
    // @ts-expect-error not a valid key
    parameters.dontExist satisfies return[];
    return [];
  }
);

createTestMock({
  parameters: { boolean: true },
});
createTestMock().updateParameters({ boolean: true });
createTestMock().updateData({ test: 'b' });

// TODO: try omit the object key "updateParameters" while keeping type defs sane
createTestMockNoParametersAndNoData().updateParameters satisfies undefined;
createTestMockNoParametersAndNoData().updateData satisfies undefined;
