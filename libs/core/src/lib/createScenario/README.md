# `createScenario` references

### `createScenario` function

`createScenario({ scenarioTitle, openPageURL }, mocksObject, mocksOptionsObject);`

| Argument             | Type                                                                                 | Description                                                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scenarioTitle`      | `string` `unique`                                                                    | An unique identifier for your scenario. If you choose to use the dashboard, this will be used as title there.                                           |
| `openPageURL`        | `string` or `(Record<keyof mocksObject, MOCK_OPTIONS_OBJ>) => string` or `undefined` | Adds an link to the dashboard to open an page where the mock can be tested                                                                              |
| `mocksObject`        | `Record<'mockIds', createMock(...)>`                                                 | Object containing `createMock` functions. The keys are used in `openPageURL` and `mockOptionsObject`.                                                   |
| `mocksOptionsObject` | `Record<keyof mocksObject, MOCK_OPTIONS_OBJ>`                                        | Object containing the keys `mocksObject` with `MOCK_OPTIONS_OBJ` as value. Used to overwrite mock options as specified in the `createMock`'s.           |
| `MOCK_OPTIONS_OBJ`   | `Record<keyof mockOptions, string number boolean>`                                   | Object containing the keys from `mockOptions` and their respective active value (`defaultValue` or an updated value after calling `updateOptions(...)`) |

<!--
TODO: considering you cannot update scenarios the return value is irrelevant
#### Returns

Object containing

| Object key   | Type         |
| ------------ | ------------ |
| `resetMocks` | `() => void` | -->

Example

```ts
import { createScenario, createMock } from '@dynamic-msw/core';

export const loginMock = createMock(
  {
    mockTitle: 'login',
    mockOptions: {
      success: true,
    },
  },
  ...
);

// Used in subsequent examples
export const exampleMock = createMock(
  {
    mockTitle: 'example',
    mockOptions: {
      success: true,
      countryCode: {
        options: ['en', 'nl'],
        defaultValue: 'en',
      },
    },
  },
  ...
);

export const exampleScenario = createScenario(
  {
    scenarioTitle: 'example scenario',
    // Optional for the dashboard
    openPageURL: (options) =>
      `http://localhost:4200/${options.exampleMock.countryCode}/example`,
  },
  { loginMock, exampleMock },
  {
    loginMock: { success: false },
    exampleMock: { countryCode: 'nl', success: false },
  }
);
```
