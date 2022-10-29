import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { createMock } from '../createMock/createMock';
import { state } from '../state/state';
import { resetHandlers, stopWorker, initializeWorker } from '../worker/worker';
import { createScenario } from './createScenario';

export const variatedExampleMock = createMock(
  {
    mockTitle: 'Variated mock options',
    mockOptions: {
      someTextOption: 'some text',
      someNumberOption: 456,
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
    return rest.get(
      'http://localhost:1234/i-am-relative',
      async (_req, res, ctx) => {
        return res(ctx.json(response));
      }
    );
  }
);

export const exampleScenario = createScenario(
  {
    scenarioTitle: 'example scenario',
    openPageURL: (config) =>
      `http://localhost:1234/${config.variatedExampleMock.someNumberOption}`,
  },
  { variatedExampleMock },
  {
    variatedExampleMock: { someNumberOption: 1111 },
  }
);

describe('createScenario', () => {
  beforeAll(() => {
    initializeWorker({
      mocks: [variatedExampleMock],
      scenarios: [exampleScenario],
      setupServer,
    });
  });
  afterEach(() => {
    resetHandlers();
  });
  afterAll(() => {
    stopWorker();
  });

  it('saves proper mock config to state', () => {
    expect(state.currentState.scenarios[0].mocks[0]).toEqual({
      mockTitle: 'variatedExampleMock',
      mockOptions: {
        someTextOption: {
          defaultValue: 'some text',
        },
        someUndefinedOption: {
          type: 'text',
          defaultValue: undefined,
        },
        someSelectOption: {
          options: ['nl', 'en'],
          defaultValue: 'nl',
        },
        someNumberOption: { defaultValue: 1111 },
      },
    });
    expect(state.currentState.scenarios[0].openPageURL).toEqual(
      `http://localhost:1234/1111`
    );
  });
  it('responds with correct data', async () => {
    exampleScenario.activateScenario();
    const response = await fetch('http://localhost:1234/i-am-relative').then(
      (res) => res.json()
    );
    expect(response.iAmNumber).toBe(1111);
  });
  it('responds with non scenario data when scenario is inactive', async () => {
    const response = await fetch('http://localhost:1234/i-am-relative').then(
      (res) => res.json()
    );
    expect(response.iAmNumber).toBe(456);
  });
  it('updates mock options', async () => {
    exampleScenario.updateScenario({
      variatedExampleMock: { someNumberOption: 123123 },
    });
    exampleScenario.activateScenario();
    exampleScenario.updateScenario({
      variatedExampleMock: { someNumberOption: 999 },
    });
    const response = await fetch('http://localhost:1234/i-am-relative').then(
      (res) => res.json()
    );
    expect(response.iAmNumber).toBe(999);
  });
});
