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

#### Returns

Object containing

| Object key         | Type                         | Description                       |
| ------------------ | ---------------------------- | --------------------------------- |
| `resetMocks`       | `() => void`                 |                                   |
| `updateScenario`   | `(MOCK_OPTIONS_OBJ) => void` | Also activates scenario           |
| `activateScenario` | `() => void`                 | Scenarios are disabled by default |

Example

Create some mocks

```ts
import { createScenario, createMock } from '@dynamic-msw/core';

// Used in subsequent examples
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
```

Create a scenario

```ts
// Used in subsequent examples
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

Activate a scenario

```ts
exampleScenario.activateScenario();
```

Update a scenario (also activates it)

```ts
exampleScenario.updateScenario({
  loginMock: { success: true },
  exampleMock: { countryCode: 'en' },
});
```
