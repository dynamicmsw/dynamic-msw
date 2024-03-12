import { ws } from 'msw';
import { setupServer } from 'msw/node';
import { WebSocket as Xxx } from 'undici';

Reflect.set(globalThis, 'WebSocket', Xxx);

const service = ws.link('wss://*');

const server = setupServer(
  service.on('connection', ({ client }) => {
    client.addEventListener('message', (event) => {
      if (event.data === 'hello') {
        client.send('hello, client!');
      }

      if (event.data === 'fallthrough') {
        client.send('ok');
      }
    });
  }),
);

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

it.concurrent(
  'resolves outgoing events using initial handlers',
  server.boundary(async () => {
    const messageListener = vi.fn();
    const ws = new WebSocket('wss://example.com');
    ws.onmessage = (event) => messageListener(event.data);
    ws.onopen = () => ws.send('hello');

    await vi.waitFor(() => {
      expect(messageListener).toHaveBeenCalledWith('hello, client!');
      expect(messageListener).toHaveBeenCalledTimes(1);
    });
  }),
);
