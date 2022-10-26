import { setupServer } from 'msw/node';
import { resetHandlers, stopWorker, initializeWorker } from 'worker/worker';

describe('test example', () => {
  beforeAll(() => {
    initializeWorker({ mocks: [exampleMock], setupServer });
  });
  afterEach(() => {
    resetHandlers();
  });
  afterAll(() => {
    stopWorker();
  });

  it('test exampleMock', async () => {
    const exampleFetch = await fetch('http://localhost:1234/test').then((res) =>
      res.json()
    );
    expect(exampleFetch).toEqual({
      success: 'yes',
    });
  });
});
