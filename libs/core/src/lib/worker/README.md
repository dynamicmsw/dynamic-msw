# worker helpers references

### `initializeWorker` function

Automatically initializes `setupWorker` or `setupServer` with all dynamic mocks and active scenarios. It also starts the worker/server.

```js
initializeWorker({
  mocks,
  scenarios,
  nonDynamicMocks,
  setupServer,
  startFnArg,
  config: { saveToLocalStorage },
});
```

| Argument             | Type                                | Description                                                                                                                                                                                                                          |
| -------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `mocks`              | `Array<typeof createMock(...)>`     | Array of `createMock(...)` functions.                                                                                                                                                                                                |
| `scenarios`          | `Array<typeof createScenario(...)>` | Array of `createScenario(...)` functions.                                                                                                                                                                                            |
| `nonDynamicMocks`    | `Array<RestHandler GraphQLHandler>` | Array non dynamic mock rest handlers.                                                                                                                                                                                                |
| `setupServer`        | `undefined` `see description`       | Optionally pass the `setupServer` function from `msw` for Node.JS environments.                                                                                                                                                      |
| `startFnArg`         | `undefined` `see description`       | Optionally pass an options argument used in the `setupWorker(...).start()` or `setupServer(...).listen()` function from `msw`.                                                                                                       |
| `saveToLocalStorage` | `boolean` `default: true`           | Saving to local storage is mainly used for the dashboard. If you choose to not use the dashboard and are updating mocks inside of your source code, you can disable this so that the dynamic mock state is reset on every page load. |

**Returns** `setupWorker()` or `setupServer()`

### `getDynamicMocks` function

For if you want full control over the way you setup and start `msw`. Requires [`setGlobalWorker()`](#setglobalworker-function)

```js
getDynamicMocks({ mocks, scenarios, config });
```

| Argument             | Type                                | Description                                                                                                                                                                                                                          |
| -------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `mocks`              | `Array<typeof createMock(...)>`     | Array of `createMock(...)` functions.                                                                                                                                                                                                |
| `scenarios`          | `Array<typeof createScenario(...)>` | Array of `createScenario(...)` functions.                                                                                                                                                                                            |
| `saveToLocalStorage` | `boolean` `default: true`           | Saving to local storage is mainly used for the dashboard. If you choose to not use the dashboard and are updating mocks inside of your source code, you can disable this so that the dynamic mock state is reset on every page load. |

**Returns** `Array<RestHandler | GraphQLHandler>` for use in `setupServer(...returnValue)` or `setupWorker(...returnValue)`

### `setGlobalWorker` function

Required when using [`getDynamicMocks()`](#getdynamicmocks-function). The argument is the return value of setupServer or setupWorker from `msw`.

```js
import { setGlobalWorker } from '@dynamic-msw/core';
import { setupServer } from 'msw/node';
import { setupWorker } from 'msw';

setGlobalWorker(setupServer() || setupWorker());
```

### `stopWorker` function

Convenience helper for when using [initializeWorker()](#initializeworker-function) to stop the worker/server.

```js
import { stopWorker } from '@dynamic-msw/core';

stopWorker();
```

### `resetHandlers` function

Reset all dynamic, scenario and non dynamic mocks to their initial state.

```js
import { resetHandlers } from '@dynamic-msw/core';

resetHandlers();
```
