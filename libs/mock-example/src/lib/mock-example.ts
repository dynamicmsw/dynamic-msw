import { createMock, setupWorker } from '@dynamic-msw/core';
import { rest } from 'msw';
import type { setupServer as setupServerMsw } from 'msw/node';

export const exampleEndpoint = 'http://localhost:1234/test';

export interface ExampleResponse {
  success: 'yes' | 'no';
}

export const exampleMock = createMock(
  {
    scenarioTitle: 'example',
    mockOptions: {
      success: {
        options: [true, false],
        defaultValue: true,
      },
    },
  },
  (config) => {
    const response: ExampleResponse = {
      success: config.success === true ? 'yes' : 'no',
    };
    return rest.get(exampleEndpoint, async (_req, res, ctx) => {
      return res(ctx.json(response));
    });
  }
);

export const setup = (setupServer?: typeof setupServerMsw) =>
  setupWorker([exampleMock], setupServer);
