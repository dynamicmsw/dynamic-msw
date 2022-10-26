# @dynamic-msw/core

WARNING: This library is in beta phase and might be patched with breaking changes. It is recommended to only use this as proof of concept.

Dynamic Mock Service Worker (Dynamic MSW) is an extension for Mock Service Worker (MSW). It conveniently makes mocked endpoint responses dynamic and updatable.
This library expects you to have a basic grasp of Mock Service Worker (MSW). It's recommended that you resort to their [own documentation](https://github.com/mswjs/msw#documentation) before getting started with Dynamic Mock Service Worker.

## Features

- **Dynamic & Flexible**. Alter mocked responses on the fly using an infinite amount of configuration parameters. Usefull for testing feature flags, error responses or what ever reason you have to alter your API mocks.

- **[Dashboard UI](../dashboard/README.md)**. Alter dynamic mocks using an user interface. This is usefull for development/smoke testing purposes.

- **Scenarios**. Want to have a predefined set of mocks configured for a specific scenario? We got you covered! Configure defaults for your mocks and bootstrap the scenario. You can even dynamically construct or set an page URL to navigate to after bootstrapping from the dashboard!

## Table of contents

- [Getting started](#getting-started)
- [Examples](#examples)
- [References](#references)
  <!-- TODO: alter API then document -->
  <!-- - [Test example](#test-example) -->

## Getting started

Install the module using yarn or npm:

- `yarn add -D @dynamic-msw/core`
- `npm i -D @dynamic-msw/core`

Create your first dynamic mock

```
import { createMock, getDynamicMocks } from '@dynamic-msw/core';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

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

const mockServer = setupServer(...getDynamicMocks({ mocks: [loginMock] }));

// Required: adds the mockServer to global.__mock_worker
setGlobalWorker(mockServer);

mockServer.listen();

loginMock.updateMock({ success: false });

loginMock.resetMock();

```

## References

- [`createMock`](./src/lib/createMock/README.md)
- [`createScenario`](./src/lib/createScenario/README.md)
- [`worker helpers`](./src/lib/worker/README.md)

## Examples

Temporary examples
[testing mocks](https://github.com/dynamicmsw/dynamic-msw/tree/main/libs/core/src/lib/core.spec.ts)
[setting up mocks](https://github.com/dynamicmsw/dynamic-msw/tree/main/libs/mock-example/src/lib/mock-example.ts)
