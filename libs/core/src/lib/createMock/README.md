# `createMock` references

### `createMock` function

`createMock({ mockTitle, openPageURL, mockOptions }, (ACTIVE_OPTIONS) => msw.RestHandler[]);`

| Argument                           |            | Type                                   | Description                                                                                                                                                                       |
| ---------------------------------- | ---------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mockTitle`                        | `required` | `string` `unique`                      | An unique identifier for your mock. If you choose to use the dashboard, this will be used as title there.                                                                         |
| `openPageURL`                      | `optional` | `string` or `(ACTIVE_OPTIONS)=>string` | Adds an link to the dashboard to open an page where the mock can be tested                                                                                                        |
| `mockOptions`                      | `required` | `Object` `Object keys: string`         | Dynamic mock options used to alter the response and/or openPageURL. The keys are used in `ACTIVE_OPTIONS` and their value will be the active value e.g. `true`.                   |
| `mockOptions.someKey`              | `required` | `string` `number` `boolean`            | An default value for your mock option. The type is automatically inherited. That means a string will become an string input in the dashboard and typed as such in your mock code. |
| `mockOptions.someKey.options`      | `optional` | `Array<string number boolean>`         | An array of possible values. Shown as select input in the dashboard.                                                                                                              |
| `mockOptions.someKey.defaultValue` | `optional` | `string` `number` `boolean`            | The default value when using select options as shown above.                                                                                                                       |
| `mockOptions.someKey.type`         | `optional` | `'text'` `'number'` `'boolean'`        | Only to be used when you don't want a default value.                                                                                                                              |
| `ACTIVE_OPTIONS`                   | --         | `{ [mockOptions.keys]: activeValue }`  | Object containing the keys from `mockOptions` and their respective active value (`defaultValue` or an updated value after calling `updateOptions(...)`)                           |

```ts
import { RestHandler } from 'msw';

const {
  mocks: RestHandler[],
  updateMock: ({ exampleMockOption: 'updateValue' }) => 'return value of createMock(...)',
  resetMock: () => 'return value of createMock(...)',
} = createMock(...)
```
