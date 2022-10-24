import { createMock, setupWorker, createScenario } from '@dynamic-msw/core';
import { rest } from 'msw';
import type { setupServer as setupServerMsw } from 'msw/node';

export const exampleEndpoint = 'http://localhost:1234/test';

export interface ExampleResponse {
  success: 'yes' | 'no';
}

export const exampleMock = createMock(
  {
    mockTitle: 'example',
    mockOptions: {
      success: {
        options: [true, false],
        defaultValue: true,
      },
    },
  },
  (options) => {
    const response: ExampleResponse = {
      success: options.success === true ? 'yes' : 'no',
    };
    return rest.get(exampleEndpoint, async (_req, res, ctx) => {
      return res(ctx.json(response));
    });
  }
);

export const variatedExampleMock = createMock(
  {
    mockTitle: 'Variated mock options',
    openPageURL: 'http://localhost:4200',
    mockOptions: {
      someTextOption: {
        defaultValue: 'text value',
      },
      someNumberOption: {
        defaultValue: 123,
      },
      someUndefinedOption: {
        type: 'text',
      },
    },
  },
  (options) => {
    const response = {
      iAmText: options.someTextOption,
      iAmNumber: options.someNumberOption,
    };
    return rest.get('/i-am-relative', async (_req, res, ctx) => {
      return res(ctx.json(response));
    });
  }
);

export const exampleScenario = createScenario(
  { scenarioTitle: 'example scenario', openPageURL: 'http://localhost:4200' },
  { exampleMock },
  { exampleMock: { success: false } }
);

export const setup = (setupServer?: typeof setupServerMsw) => {
  const dynamicMocks = setupWorker({
    mocks: [exampleMock, variatedExampleMock],
    scenarios: [exampleScenario],
    setupServer,
    startFnArg: { onUnhandledRequest: 'bypass' },
  });

  return dynamicMocks;
};
