import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { createMock } from './createMock';
import type { StorageState } from './state';
import { dynamicMswStorageKey } from './state';
import { resetHandlers, stopWorker, setupWorker } from './worker';

const config = {
  success: {
    options: [true, false],
    defaultValue: true,
  },
};

export const exampleMock = createMock(
  {
    id: 'example',
    openPage: (config) => (config.success ? 'yes-page' : 'no-page'),
    config,
  },
  (config) => {
    return rest.get('http://localhost:1234/test', async (req, res, ctx) => {
      return res(
        ctx.json({
          success: config.success === true ? 'yes' : 'no',
        })
      );
    });
  }
);

describe('dynamicMsw', () => {
  beforeAll(() => {
    setupWorker([exampleMock], setupServer);
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
    expect(exampleMock.pageUrl).toBe('yes-page');
  });
  it('returns proper page URL when updating mock', async () => {
    exampleMock.updateMock({ success: false });
    expect(exampleMock.pageUrl).toBe('no-page');
  });
  it('resets createMock return value when calling resetHandlers()', async () => {
    exampleMock.updateMock({ success: false });
    resetHandlers();
    expect(exampleMock.pageUrl).toBe('yes-page');
  });

  it('saves state to sessionStorage', () => {
    const expectedState: StorageState = {
      createMocksConfig: {
        example: {
          updatedConfig: { success: true },
          config,
          pageUrl: 'yes-page',
        },
      },
    };
    expect(JSON.parse(sessionStorage.getItem(dynamicMswStorageKey))).toEqual(
      expectedState
    );
  });
  it('updates state in sessionStorage', () => {
    exampleMock.updateMock({ success: false });
    const expectedState: StorageState = {
      createMocksConfig: {
        example: {
          updatedConfig: { success: false },
          config,
          pageUrl: 'no-page',
        },
      },
    };
    expect(JSON.parse(sessionStorage.getItem(dynamicMswStorageKey))).toEqual(
      expectedState
    );
  });
  it('initializes with storage state', async () => {
    exampleMock.updateMock({ success: false });
    stopWorker();
    setupWorker([exampleMock]);
    const updatedExampleFetch = await fetch('http://localhost:1234/test').then(
      (res) => res.json()
    );
    expect(updatedExampleFetch).toEqual({
      success: 'no',
    });
  });
});
