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
- [Usage example](#usage-example)
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

## Usage example

```
import {
  createMock,
  getDynamicMocks,
  createScenario,
  setGlobalWorker,
} from '@dynamic-msw/core';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

export const exampleMock = createMock(
  {
    mockTitle: 'example',
    openPageURL: 'http://localhost:4200/example',
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

export const exampleScenario = createScenario(
  {
    scenarioTitle: 'example scenario',
    openPageURL: (options) =>
      `http://localhost:4200/${options.exampleMock.countryCode}/example`,
  },
  { exampleMock },
  { exampleMock: { countryCode: 'nl', success: false } }
);

const mockServer = setupServer(
  ...getDynamicMocks({ mocks: [exampleMock], scenarios: [exampleScenario] })
);

// Required: adds the mockServer to global.__mock_worker
setGlobalWorker(mockServer);

mockServer.listen();

exampleMock.updateMock({ success: false });

exampleMock.resetMock();

```

## Getting started

- [Core](./libs/core/README.md#getting-started)
- [Dashboard](./libs/dashboard/README.md#setup)

## Framework examples

- [Next.JS](./examples/next)

# Looking for collaborators

Wanna help improve Dynamic Mock Service Worker? Great! You can get in touch via [bramzijpcode@gmail.com](mailto:bramzijpcode@gmail.com?subject=[Dynamic-MSW]Collaboration).
