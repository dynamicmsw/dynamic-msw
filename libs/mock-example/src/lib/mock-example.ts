import {
  createMock,
  initializeWorker,
  createScenario,
} from '@dynamic-msw/core';
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
      success: true,
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
    openPageURL: '/iframe.html?id=development-examplemocks--primary',
    mockOptions: {
      someTextOption: 'text value',
      someNumberOption: 123,
      someUndefinedOption: {
        type: 'text',
      },
      someSelectOption: {
        options: ['nl', 'en'],
        defaultValue: 'nl',
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
  {
    scenarioTitle: 'example scenario',
    openPageURL: '/iframe.html?id=development-examplemocks--primary',
  },
  { exampleMock, variatedExampleMock },
  {
    exampleMock: { success: false },
    variatedExampleMock: { someNumberOption: 123 },
  }
);

export const setup = (setupServer?: typeof setupServerMsw) => {
  const mockWorker = initializeWorker({
    mocks: [exampleMock, variatedExampleMock],
    scenarios: [exampleScenario],
    setupServer,
    startFnArg: { onUnhandledRequest: 'bypass' },
  });

  return mockWorker;
};
