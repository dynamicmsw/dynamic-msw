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
  (config) => {
    const response: ExampleResponse = {
      success: config.success === true ? 'yes' : 'no',
    };
    return rest.get(exampleEndpoint, async (_req, res, ctx) => {
      return res(ctx.json(response));
    });
  }
);

export const variatedExampleMock = ({
  someNumberOption = 123,
}: { someNumberOption?: number } | undefined = {}) =>
  createMock(
    {
      mockTitle: 'Variated mock options',
      openPageURL: '#',
      mockOptions: {
        someTextOption: {
          defaultValue: 'text value',
        },
        someNumberOption: {
          defaultValue: someNumberOption,
        },
        someUndefinedOption: {
          type: 'text',
        },
      },
    },
    (config) => {
      const response = {
        iAmText: config.someTextOption,
        iAmNumber: config.someNumberOption,
      };
      return rest.get('/i-am-relative', async (_req, res, ctx) => {
        return res(ctx.json(response));
      });
    }
  );

export const exampleScenario = createScenario('example scenario', [
  exampleMock,
  variatedExampleMock({ someNumberOption: 456 }),
]);

export const setup = (setupServer?: typeof setupServerMsw) =>
  setupWorker(
    [exampleMock, variatedExampleMock(), ...exampleScenario.mocks],
    setupServer
  );
