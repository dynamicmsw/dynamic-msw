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

export const variatedExampleEndpoint =
  'http://localhost:1234/variated-example-mock';

export interface VariatedExampleResponse {
  iAmBoolean: boolean;
  iAmText: string;
  iAmNumber: number;
  iHaveNoDefault: string | undefined;
  iAmSelectOption: string;
}

export const variatedExampleMock = createMock(
  {
    mockTitle: 'Variated mock options',
    openPageURL: '/iframe.html?id=development-examplemocks--primary',
    mockOptions: {
      someBooleanOption: true,
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
    const response: VariatedExampleResponse = {
      iAmBoolean: options.someBooleanOption,
      iAmText: options.someTextOption,
      iAmNumber: options.someNumberOption,
      iHaveNoDefault: options.someUndefinedOption,
      iAmSelectOption: options.someSelectOption,
    };
    return rest.get(variatedExampleEndpoint, async (_req, res, ctx) => {
      return res(ctx.json(response));
    });
  }
);

export const unusedMock = createMock(
  {
    mockTitle: 'unused-example',
    mockOptions: {
      success: true,
    },
  },
  (options) => {
    const response: ExampleResponse = {
      success: options.success === true ? 'yes' : 'no',
    };
    return rest.get('unused-example', async (_req, res, ctx) => {
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
    variatedExampleMock: { someNumberOption: 345 },
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
