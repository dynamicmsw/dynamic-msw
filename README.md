<h1 align="center">Dynamic Mock Service Worker</h1>

WARNING: This library is in beta phase and might be patched with breaking changes. It is recommended to only use this as proof of concept.

Dynamic Mock Service Worker (Dynamic MSW) is an extension for Mock Service Worker (MSW). It conveniently makes mocked endpoint responses dynamic and updatable.
This library expects you to have a basic grasp of Mock Service Worker (MSW). It's recommended that you resort to their [own documentation](https://github.com/mswjs/msw#documentation) before getting started with Dynamic Mock Service Worker.

## Features

- **Dynamic & Flexible**. Alter mocked responses on the fly using an infinite amount of configuration parameters. Usefull for testing feature flags, error responses or what ever reason you have to alter your API mocks.

- **[Dashboard UI](../dashboard/README.md)**. Alter dynamic mocks using an user interface. This is usefull for development/smoke testing purposes.

- **Scenarios**. Want to have a predefined set of mocks configured for a specific scenario? We got you covered! Configure defaults for your mocks and bootstrap the scenario. You can even dynamically construct or set an page URL to navigate to after bootstrapping from the dashboard!

## Table of contents

- [Setup](#setup)
  - [Setup core without Dashboard](#setup-core-without-dashboard)
  - [Setup with Dashboard](#setup-with-dashboard)
- [Usage examples](#usage-examples)
- [Getting started](#getting-started)
- [Framework examples](#framework-examples)

## Setup

#### Setup core without dashboard

Install the module using yarn or npm:

- `yarn add -D @dynamic-msw/core`
- `npm i -D @dynamic-msw/core`

#### Setup with dashboard

Install the modules using yarn or npm:

- `yarn add -D @dynamic-msw/core @dynamic-msw/dashboard`
- `npm i -D @dynamic-msw/core @dynamic-msw/dashboard`

Run the `initMockServer` command (you can alter 'mock-dashboard' with any location you prefer):

- `npx initMockServer <PUBLIC_DIR>/mock-dashboard`

Replace the `<PUBLIC_DIR>` placeholder with the relative path to your server's public directory. For example, in a Create React App project this command would be:

- `npx initMockServer public/mock-dashboard`

Don't forget to initialize MSW for the browser if you didn't already:

- `npx msw init <PUBLIC_DIR> --save`

Replace the `<PUBLIC_DIR>` placeholder with the relative path to your server's public directory. For example, in a Create React App project this command would be:

- `npx msw init public/ --save`

## Usage examples

Create your first dynamic mocks:

```js
import { createMock, getDynamicMocks } from '@dynamic-msw/core';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Used in subsequent examples
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

// Used in subsequent examples
export const exampleMock = createMock(
  {
    mockTitle: 'example',
    openPageURL: 'http://localhost:4200/example', // Optional for the dashboard
    mockOptions: {
      success: true,
      countryCode: {
        options: ['en', 'nl'],
        defaultValue: 'en',
      },
      someNumberOption: 123,
      textWithoutDefault: {
        type: 'text',
      },
    },
  },
  (options) => {
    const response = {
      success: options.success === true ? 'yes' : 'no',
      countryCode: options.countryCode,
      number: options.someNumberOption,
      content: options.textWithoutDefault,
    };

    return rest.get('http://localhost:1234/example', async (_req, res, ctx) => {
      return res(ctx.json(response));
    });
  }
);
```

Create a scenario (optional):

```js
import { createScenario } from '@dynamic-msw/core';

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

Option A: Starting up the MSW server manually:

```js
import { getDynamicMocks, setGlobalWorker } from '@dynamic-msw/core';
import { setupServer } from 'msw/node';

const mockServer = setupServer(
  ...getDynamicMocks({
    mocks: [loginMock, exampleMock],
    scenarios: [exampleScenario],
  })
);

setGlobalWorker(mockServer);

mockServer.listen();
```

Option B: Starting up the MSW server automatically:

```js
import { initializeWorker } from '@dynamic-msw/core';
import { setupServer } from 'msw/node';

const mockWorker = initializeWorker({
  mocks: [loginMock, exampleMock],
  scenarios: [exampleScenario],
  setupServer, // Optional for Node.JS environments
});
```

Updating mocks:

```js
loginMock.updateMock({ success: false });
exampleMock.updateMock({ countryCode: 'nl', success: true });

exampleMock.resetMock();
```

Reset all mocks and scenarios:

```js
import { resetHandlers } from '@dynamic-msw/core';

resetHandlers();
```

Test example:

```js
import { setupServer } from 'msw/node';

import { resetHandlers, stopWorker, initializeWorker } from '@dynamic-msw/core';

describe('test example', () => {
  beforeAll(() => {
    initializeWorker({ mocks: [exampleMock], setupServer });
  });
  afterEach(() => {
    resetHandlers();
  });
  afterAll(() => {
    stopWorker();
  });

  it('test exampleMock', async () => {
    const exampleFetch = await fetch('http://localhost:1234/test').then((res) =>
      res.json()
    );
    expect(exampleFetch).toEqual({
      success: 'yes',
    });
  });
});
```

## Getting started

- [Core](./libs/core/README.md#getting-started)
- [Dashboard](./libs/dashboard/README.md#setup)

## Framework examples

- [Next.JS](./examples/next)

# Looking for collaborators

Wanna help improve Dynamic Mock Service Worker? Great! You can get in touch via [bramzijpcode@gmail.com](mailto:bramzijpcode@gmail.com?subject=[Dynamic-MSW]Collaboration).
