import { createMock, setupWorker, createScenario } from '@dynamic-msw/core';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

export const exampleMock = createMock(
  {
    mockTitle: 'example',
    openPageURL: 'http://localhost:4200/example',
    mockOptions: {
      success: {
        options: [true, false],
        defaultValue: true,
      },
      countryCode: {
        defaultValue: 'en',
      },
      someNumberOption: {
        defaultValue: 123,
      },
      textWithoutDefault: {
        type: 'text',
      },
    },
  },
  (config) => {
    const response = {
      success: config.success === true ? 'yes' : 'no',
      countryCode: config.countryCode,
      number: config.someNumberOption,
      content: config.textWithoutDefault,
    };

    return rest.get('http://localhost:1234/example', async (_req, res, ctx) => {
      return res(ctx.json(response));
    });
  }
);

export const exampleScenario = createScenario(
  {
    scenarioTitle: 'example scenario',
    openPageURL: (config) =>
      `http://localhost:4200/${config.exampleMock.countryCode}/example`,
  },
  { exampleMock },
  { exampleMock: { countryCode: 'nl', success: false } }
);

setupWorker({
  mocks: [exampleMock],
  scenarios: [exampleScenario],
  setupServer,
});
