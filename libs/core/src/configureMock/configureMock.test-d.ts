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
  ({ getParams }) => {
    getParams().string satisfies string | number;
    getParams().number satisfies number;
    getParams().boolean satisfies boolean;
    // getParams().nullableStringWithoutDefault satisfies string | null;
    getParams().stringWithInputTypeAndDefaultValue satisfies string | null;

    // TODO add no unused lint rules warning
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (getParams().stringWithInputTypeAndDefaultValue === null) {
      //
    }

    //@ts-expect-error can't be null
    getParams().boolean satisfies null;
    //@ts-expect-error does not exist
    getParams().dontExist satisfies unknown;
    // @ts-expect-error 'e' is not an possible value of the select array
    getParams().select satisfies 'e';
    return [];
  },
);
configureMock(
  {
    key: 'testMockNoParametersAndData',
    data: { some: 'data' },
  },
  ({ getParams, getData, setData }) => {
    getData() satisfies { some: string };
    setData satisfies (update: { some: string }) => void;
    getParams satisfies never;
    return [];
  },
);
export const createTestMockNoParametersAndNoData = configureMock(
  {
    key: 'testMockParametersAndNoData',
  },
  // @ts-expect-error param should be never without data and parameters
  (_x) => {
    return [];
  },
);

createTestMock({
  parameters: { boolean: true },
});
createTestMock().updateParameters({ boolean: true });
createTestMock().setData({ test: 'b' });

// TODO: try omit the object key "updateParameters" while keeping type defs sane
createTestMockNoParametersAndNoData().updateParameters satisfies undefined;
createTestMockNoParametersAndNoData().setData satisfies undefined;
