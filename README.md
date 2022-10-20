<h1 align="center">Dynamic Mock Service Worker</h1>

Dynamic Mock Service Worker (Dynamic MSW) is an extension for Mock Service Worker (MSW). It conveniently makes mocked endpoint responses dynamic and updatable.

## Features

- **Dynamic & Flexible**. Alter mocked responses on the fly using an infinite amount of configuration parameters. Usefull for testing feature flags, error responses or what ever reason you have to alter your API mocks.

- **Dashboard UI**. Alter dynamic mocks using an user interface. This is usefull for development/smoke testing purposes.

- **Scenarios**. Want to have a predefined set of mocks configured for a specific scenario? We got you covered! Configure defaults for your mocks and bootstrap the scenario. You can even dynamically construct or set an page URL to navigate to after bootstrapping from the dashboard!

## Setup

1. `yarn add -D @dynamic-msw/core @dynamic-msw/dashboard` or
   `npm i -D @dynamic-msw/core @dynamic-msw/dashboard -D`
2. Setup the dashboard if you wanna use it
   `yarn setupMockServer ./PATH_TO_PUBLIC_FOLDER/mock-server`
   `npx setupMockServer ./PATH_TO_PUBLIC_FOLDER/mock-server`

## Usage example

```
import { createMock, setupWorker, createScenario } from '@dynamic-msw/core';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

export const exampleMock = createMock(
  {
    mockTitle: "example",
    openPageURL: 'http://localhost:4200/example',
    mockOptions: {
      success: {
        options: [true, false],
        defaultValue: true,
      },
      countryCode: {
        defaultValue: "en",
      },
      someNumberOption: {
        defaultValue: 123,
      },
      textWithoutDefault: {
        type: "text",
      },
    },
  },
  (config) => {
    const response = {
      success: config.success === true ? "yes" : "no",
      countryCode: config.countryCode,
      number: config.someNumberOption,
      content: config.textWithoutDefault',
    };
    return rest.get("http://localhost:1234/example", async (_req, res, ctx) => {
      return res(ctx.json(response));
    });
  }
);


export const exampleScenario = createScenario(
  { scenarioTitle: 'example scenario', openPageURL: (config) => `http://localhost:4200/${config.exampleMock.countryCode}/example`},
  { exampleMock },
  { exampleMock: { countryCode: 'nl', success: false } }
);

setupWorker({
  mocks: [exampleMock],
  scenarios: [exampleScenario],
  setupServer,
});
```

## Framework examples

- [Next.JS](./examples/next)

<h1 align="center">Looking for collaboratos</h1>

Wanna help improve Dynamic Mock Service Worker? Great! You can get in touch via [bramzijpcode@gmail.com](mailto:bramzijpcode@gmail.com?subject=[Dynamic-MSW]Collaboration).
