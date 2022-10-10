import { createMock, setupWorker } from '@dynamic-msw/core';
import { rest } from 'msw';

export const exampleEndpoint = 'http://localhost:1234/test';

export interface ExampleResponse {
  success: 'yes' | 'no';
}

export const exampleMock = createMock(
  {
    id: 'example',
    config: {
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

export const setup = () => setupWorker([exampleMock]);
