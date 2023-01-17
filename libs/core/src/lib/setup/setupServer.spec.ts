import { rest } from 'msw';

import { createMock } from '../createMock/createMock';
import { setupServer } from './setupServer';

const initialResponse = {
  hello: 'universe',
  example: 'option',
  example2: '2',
};
const exampleMock = createMock(
  { title: 'safd', options: { example: 'option', example2: '2' } },
  (o) => [
    rest.get('http://localhost/test/', (req, res, ctx) =>
      res(ctx.json({ ...initialResponse, ...o }))
    ),
  ]
);

const server = setupServer(
  exampleMock,
  rest.get('http://localhost/test-2/', (req, res, ctx) =>
    res(ctx.json({ hello: '2' }))
  )
);

beforeAll(() => {
  server.listen();
});

test('it should reset', async () => {
  expect(
    await fetch('http://localhost/test/').then((res) => res.json())
  ).toEqual(initialResponse);

  const updatedResponse = { hello: 'world', example: 'option', example2: '2' };
  server.use(
    rest.get('http://localhost/test/', (req, res, ctx) =>
      res(ctx.json(updatedResponse))
    )
  );

  expect(
    await fetch('http://localhost/test/').then((res) => res.json())
  ).toEqual(updatedResponse);
  expect(
    await fetch('http://localhost/test-2/').then((res) => res.json())
  ).toEqual({ hello: '2' });

  server.use(
    rest.get('http://localhost/test-2/', (req, res, ctx) =>
      res(ctx.json({ hello: '3' }))
    )
  );

  expect(
    await fetch('http://localhost/test-2/').then((res) => res.json())
  ).toEqual({ hello: '3' });

  server.resetAllHandlers();

  expect(
    await fetch('http://localhost/test/').then((res) => res.json())
  ).toEqual(initialResponse);
  expect(
    await fetch('http://localhost/test-2/').then((res) => res.json())
  ).toEqual({ hello: '2' });

  const updatedOption = { example: 'updated' };

  exampleMock.updateOptions(updatedOption);

  expect(
    await fetch('http://localhost/test/').then((res) => res.json())
  ).toEqual({ ...initialResponse, ...updatedOption });

  server.resetAllHandlers();

  expect(
    await fetch('http://localhost/test/').then((res) => res.json())
  ).toEqual(initialResponse);

  exampleMock.updateOptions({ example2: '3' });

  expect(
    await fetch('http://localhost/test/').then((res) => res.json())
  ).toEqual({ ...initialResponse, example2: '3' });
});
