# `createMock` references

### `createMock` function

`createMock({ mockTitle, openPageURL, mockOptions }, (ACTIVE_OPTIONS) => Array<RestHandler | GraphQLHandler>);`

| Argument                           | Type                                                                                | Description                                                                                                                                                                       |
| ---------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mockTitle`                        | `string` `unique`                                                                   | An unique identifier for your mock. If you choose to use the dashboard, this will be used as title there.                                                                         |
| `openPageURL`                      | `string` `(Record<keyof mockOptions, string number boolean>) => string` `undefined` | Adds an link to the dashboard to open an page where the mock can be tested                                                                                                        |
| `mockOptions`                      | `Record<'optionIds', ...>`                                                          | Dynamic mock options used to alter the response and/or openPageURL. The keys are used in `ACTIVE_OPTIONS` and their value will be the active value e.g. `true`.                   |
| `mockOptions.someKey`              | `string` `number` `boolean` `object`                                                | An default value for your mock option. The type is automatically inherited. That means a string will become an string input in the dashboard and typed as such in your mock code. |
| `mockOptions.someKey.options`      | `Array<string number boolean>` `undefined`                                          | An array of possible values. Shown as select input in the dashboard.                                                                                                              |
| `mockOptions.someKey.defaultValue` | `string` `number` `boolean` `undefined`                                             | The default value when using select options as shown above.                                                                                                                       |
| `mockOptions.someKey.type`         | `'text'` `'number'` `'boolean'` `undefined`                                         | Only to be used when you don't want a default value.                                                                                                                              |
| `ACTIVE_OPTIONS`                   | `Record<keyof mockOptions, string number boolean>`                                  | Object containing the keys from `mockOptions` and their respective active value (`defaultValue` or an updated value after calling `updateOptions(...)`)                           |

#### Returns

Object containing

| Object key   | Type                                                                        |
| ------------ | --------------------------------------------------------------------------- |
| `updateMock` | `(updateOptions: Record<keyof mockOptions, string number boolean>) => void` |
| `resetMock`  | `() => void`                                                                |

Example

```ts
import { createMock } from '@dynamic-msw/core';
import { rest } from 'msw';

export const loginMock = createMock(
  {
    mockTitle: 'login',
    mockOptions: {
      success: true,
    },
  },
  (options) => {
    return rest.post('/login', async (req, res, ctx) => {
      const { username } = await req.json();

      return options.success
        ? res(
            ctx.json({
              firstName: 'John',
            })
          )
        : res(
            ctx.status(403),
            ctx.json({
              errorMessage: `User '${username}' not found`,
            })
          );
    });
  }
);

loginMock.updateMock({ success: false });

loginMock.resetMock();
```
