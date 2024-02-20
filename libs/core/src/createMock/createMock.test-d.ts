import createMock from "./createMock";

export const testMock = createMock(
  {
    key: "testKey",
    parameters: {
      string: "test-string",
      number: 1,
      boolean: true,
      nullableStringWithoutDefault: {
        dashboardInputType: "string",
        nullable: true,
      },
      stringWithInputTypeAndDefaultValue: {
        dashboardInputType: "string",
        defaultValue: "test-string",
      },
    },
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
    return [];
  }
);
