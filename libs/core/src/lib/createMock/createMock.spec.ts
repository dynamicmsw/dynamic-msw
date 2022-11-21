import { rest } from 'msw';
import { setupServer } from 'msw/node';

import type { State } from '../storageState/storageState';
import {
  loadFromStorage,
  dynamicMswStorageKey,
} from '../storageState/storageState';
import { resetHandlers, stopWorker, initializeWorker } from '../worker/worker';
import { createMock } from './createMock';

const mockOptions = {
  success: {
    options: [true, false] as const,
    defaultValue: true,
  },
  optionTwo: 'hello',
};

export const exampleMock = createMock(
  {
    mockTitle: 'example',
    openPageURL: (config) => (config.success ? 'yes-page' : 'no-page'),
    mockOptions,
  },
  (config) => {
    return rest.get('http://localhost:1234/test', async (_req, res, ctx) => {
      return res(
        ctx.json({
          success: config.success === true ? 'yes' : 'no',
        })
      );
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
    return rest.get(
      'http://localhost:1234/unused-example',
      async (_req, res, ctx) => {
        return res(ctx.json(options));
      }
    );
  }
);

describe('createMock', () => {
  beforeAll(() => {
    initializeWorker({
      mocks: [exampleMock],
      setupServer,
      startFnArg: { onUnhandledRequest: 'bypass' },
    });
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
  it('does not resolve unused mocks', async () => {
    expect.assertions(1);
    await fetch('http://localhost:1234/unused-example').catch((err) => {
      expect(err).toBeInstanceOf(Error);
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
    expect(loadFromStorage().mocks[0].openPageURL).toBe('yes-page');
  });

  it('saves state to localStorage', () => {
    const expectedState: Partial<State> = {
      mocks: [
        {
          mockTitle: 'example',
          mockOptions: {
            success: {
              options: [true, false] as const,
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
});

describe('createMock -> without saving to local storage', () => {
  beforeAll(() => {
    localStorage.removeItem(dynamicMswStorageKey);
    initializeWorker({
      mocks: [exampleMock],
      setupServer,
      config: { saveToLocalStorage: false },
      startFnArg: { onUnhandledRequest: 'bypass' },
    });
  });
  afterEach(() => {
    resetHandlers();
  });
  afterAll(() => {
    stopWorker();
  });
  it('should not save to local storage', async () => {
    const storageSpy = jest.spyOn(localStorage, 'setItem');
    initializeWorker({
      mocks: [exampleMock],
      setupServer,
      config: { saveToLocalStorage: false },
      startFnArg: { onUnhandledRequest: 'bypass' },
    });
    exampleMock.updateMock({ success: false });
    resetHandlers();
    expect(storageSpy).not.toBeCalled();
  });
  it('works when initilized', async () => {
    const exampleFetch = await fetch('http://localhost:1234/test').then((res) =>
      res.json()
    );
    expect(exampleFetch).toEqual({
      success: 'yes',
    });
  });
  it('does not resolve unused mocks', async () => {
    expect.assertions(1);
    await fetch('http://localhost:1234/unused-example').catch((err) => {
      expect(err).toBeInstanceOf(Error);
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
});
