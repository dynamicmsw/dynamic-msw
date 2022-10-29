import { rest } from 'msw';
import { setupServer } from 'msw/node';

import type { State } from '../state/state';
import { dynamicMswStorageKey, state, saveToStorage } from '../state/state';
import { resetHandlers, stopWorker, initializeWorker } from '../worker/worker';
import { createMock } from './createMock';

const mockOptions = {
  success: {
    options: [true, false],
    defaultValue: true,
  },
  optionTwo: 'hello',
};

const createMockHandler = (config) => {
  return rest.get('http://localhost:1234/test', async (_req, res, ctx) => {
    return res(
      ctx.json({
        success: config.success === true ? 'yes' : 'no',
      })
    );
  });
};

export const exampleMock = createMock(
  {
    mockTitle: 'example',
    openPageURL: (config) => (config.success ? 'yes-page' : 'no-page'),
    mockOptions,
  },
  createMockHandler
);

describe('dynamicMsw', () => {
  beforeAll(() => {
    initializeWorker({ mocks: [exampleMock], setupServer });
  });
  afterEach(() => {
    resetHandlers();
  });
  afterAll(() => {
    stopWorker();
  });

  it('works when initilized', async () => {
    const exampleFetch = await fetch('http://localhost:1234/test').then((res) =>
      res.json()
    );
    expect(exampleFetch).toEqual({
      success: 'yes',
    });
  });
  it('works when updateMock is called', async () => {
    exampleMock.updateMock({ success: false });
    const updatedExampleFetch = await fetch('http://localhost:1234/test').then(
      (res) => res.json()
    );
    expect(updatedExampleFetch).toEqual({
      success: 'no',
    });
  });
  it('works when resetMock is called', async () => {
    exampleMock.updateMock({ success: false });
    exampleMock.resetMock();
    const resetExampleFetch = await fetch('http://localhost:1234/test').then(
      (res) => res.json()
    );
    expect(resetExampleFetch).toEqual({
      success: 'yes',
    });
  });
  it('should reset when resetHandlers is called', async () => {
    exampleMock.updateMock({ success: false });
    resetHandlers();
    const exampleFetch = await fetch('http://localhost:1234/test').then((res) =>
      res.json()
    );
    expect(exampleFetch).toEqual({
      success: 'yes',
    });
  });
  it('returns proper page URL based on config', async () => {
    expect(state.currentState.mocks[0].openPageURL).toBe('yes-page');
  });
  it('returns proper page URL when updating mock', async () => {
    exampleMock.updateMock({ success: false });
    expect(state.currentState.mocks[0].openPageURL).toBe('no-page');
  });
  it('resets createMock return value when calling resetHandlers()', async () => {
    exampleMock.updateMock({ success: false });
    resetHandlers();
    expect(state.currentState.mocks[0].openPageURL).toBe('yes-page');
  });

  it('saves state to localStorage', () => {
    const expectedState: Partial<State> = {
      mocks: [
        {
          mockTitle: 'example',
          mockOptions: {
            success: {
              options: [true, false],
              defaultValue: true,
            },
            optionTwo: { defaultValue: 'hello' },
          },
          openPageURL: 'yes-page',
        },
      ],
      scenarios: [],
    };
    expect(JSON.parse(localStorage.getItem(dynamicMswStorageKey))).toEqual(
      expectedState
    );
  });
  it('updates state in localStorage', () => {
    exampleMock.updateMock({ success: false });
    const expectedState: State = {
      mocks: [
        {
          mockTitle: 'example',
          mockOptions: {
            success: { ...mockOptions.success, selectedValue: false },
            optionTwo: {
              defaultValue: 'hello',
            },
          },
          openPageURL: 'no-page',
        },
      ],
      scenarios: [],
    };
    expect(JSON.parse(localStorage.getItem(dynamicMswStorageKey))).toEqual(
      expectedState
    );
  });
  it('initializes with storage state', async () => {
    exampleMock.updateMock({ success: false });
    stopWorker();
    initializeWorker({ mocks: [exampleMock], setupServer });
    const updatedExampleFetch = await fetch('http://localhost:1234/test').then(
      (res) => res.json()
    );
    expect(updatedExampleFetch).toEqual({
      success: 'no',
    });
  });

  it('initializes with storage state', async () => {
    saveToStorage({
      mocks: [
        {
          mockTitle: 'example',
          mockOptions: {
            success: {
              options: [true, false],
              defaultValue: true,
              selectedValue: false,
            },
          },
          createMockHandler,
        },
      ],
      scenarios: [],
    });

    initializeWorker({ mocks: [exampleMock], setupServer });
    const updatedExampleFetch = await fetch('http://localhost:1234/test').then(
      (res) => res.json()
    );
    expect(updatedExampleFetch).toEqual({
      success: 'no',
    });
  });
});
