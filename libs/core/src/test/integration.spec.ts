import { expect, test, afterEach } from 'vitest';
import { HttpResponse, http } from 'msw';
import { createTestMock } from './testMock';
import { createScenario, testScenarioMock } from './testScenario';
import { type Todo, createTodoMocks, testTodos } from './dataCrudTestMock';
import { setupServer } from 'msw/node';
import setupHandlers from '../setup/setupHandlers';
const testMock = createTestMock();
const testTodosMock = createTodoMocks();
const testScenario = createScenario({
  parameters: {
    testScenarioMock: {
      boolean: false,
    },
  },
  data: {
    testScenarioMock: {
      some: 'other data',
    },
  },
});

const initialScenarioParameters = {
  string: 'test-string',
  number: 1,
  boolean: false,
  nullableStringWithoutDefault: null,
  stringWithInputTypeAndDefaultValue: 'test-string-default-value',
};
const initialParameters = {
  string: 'test-string',
  number: 1,
  boolean: true,
  nullableStringWithoutDefault: null,
  stringWithInputTypeAndDefaultValue: 'test-string-default-value',
};

const dynamic = setupHandlers(
  testScenario,
  testMock,
  http.get(
    'http://localhost/get-once',
    () => {
      return HttpResponse.json({ onceResponseNonDynamic: true });
    },
    { once: true },
  ),
  testTodosMock,
);

const server = setupServer(...dynamic.handlers);
server.listen();

afterEach(() => {
  dynamic.resetAll();
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

test('Updates dynamic mocks parameters and resets properly', async () => {
  expect(
    await fetch('http://localhost/some-get-1').then((res) => res.json()),
  ).toEqual(initialScenarioParameters);
  const updatedString1 = 'updated-string';
  testScenario.updateParameters({
    testScenarioMock: { string: updatedString1 },
  });
  expect(
    await fetch('http://localhost/some-get-1').then((res) => res.json()),
  ).toEqual({ ...initialScenarioParameters, string: updatedString1 });
  expect(
    await fetch('http://localhost/some-get').then((res) => res.json()),
  ).toEqual(initialParameters);
  const updatedString = 'updated-string';
  testMock.updateParameters({ string: updatedString });
  expect(
    await fetch('http://localhost/some-get').then((res) => res.json()),
  ).toEqual({ ...initialParameters, string: updatedString });
  server.resetHandlers();
  expect(
    await fetch('http://localhost/some-get-1').then((res) => res.json()),
  ).toEqual(initialScenarioParameters);
  testScenario.updateParameters({
    testScenarioMock: { string: updatedString },
  });
  expect(
    await fetch('http://localhost/some-get-1').then((res) => res.json()),
  ).toEqual({ ...initialScenarioParameters, string: updatedString });
  testScenarioMock.reset();
  expect(
    await fetch('http://localhost/some-get-1').then((res) => res.json()),
  ).toEqual(initialScenarioParameters);
});

test('Does not consider an previously called HttpResponse called after updating paramaters', async () => {
  expect(
    await fetch('http://localhost/get-once-dynamic-1').then((res) =>
      res.json(),
    ),
  ).toEqual({ onceResponse: true });
  const updatedString = 'updated-string';
  testScenario.updateParameters({
    testScenarioMock: { string: updatedString },
  });
  await expect(
    fetch('http://localhost/get-once-dynamic-1').then((res) => res.json()),
  ).rejects.toThrow();
});

test('Considers an non-dynamic and dynamic HttpResponse un-called after `server.resetHandlers` is called', async () => {
  expect(
    await fetch('http://localhost/get-once-dynamic-1').then((res) =>
      res.json(),
    ),
  ).toEqual({ onceResponse: true });
  expect(
    await fetch('http://localhost/get-once').then((res) => res.json()),
  ).toEqual({ onceResponseNonDynamic: true });
  server.resetHandlers();
  expect(
    await fetch('http://localhost/get-once-dynamic-1').then((res) =>
      res.json(),
    ),
  ).toEqual({ onceResponse: true });
  expect(
    await fetch('http://localhost/get-once').then((res) => res.json()),
  ).toEqual({ onceResponseNonDynamic: true });
});
test('Considers an non-dynamic and dynamic HttpResponse un-called after `server.resetHandlers` is called', async () => {
  expect(
    await fetch('http://localhost/get-once-dynamic-1').then((res) =>
      res.json(),
    ),
  ).toEqual({ onceResponse: true });
  expect(
    await fetch('http://localhost/get-once').then((res) => res.json()),
  ).toEqual({ onceResponseNonDynamic: true });
  server.resetHandlers();
  expect(
    await fetch('http://localhost/get-once-dynamic-1').then((res) =>
      res.json(),
    ),
  ).toEqual({ onceResponse: true });
  expect(
    await fetch('http://localhost/get-once').then((res) => res.json()),
  ).toEqual({ onceResponseNonDynamic: true });
});

test('Updates dynamic mocks data and resets properly', async () => {
  expect(
    await fetch('http://localhost/todos').then((res) => res.json()),
  ).toEqual(testTodos);
  testTodosMock.setData({ todos: [] });
  expect(
    await fetch('http://localhost/todos').then((res) => res.json()),
  ).toEqual([]);
  const newTodo: Todo = { id: 'new-todo', title: 'new-todo', done: false };
  await fetch('http://localhost/todos/create', {
    method: 'POST',
    body: JSON.stringify(newTodo),
  });
  expect(
    await fetch('http://localhost/todos').then((res) => res.json()),
  ).toEqual([newTodo]);
  server.resetHandlers();
  expect(
    await fetch('http://localhost/todos').then((res) => res.json()),
  ).toEqual(testTodos);
  testTodosMock.setData({ todos: [] });
  expect(
    await fetch('http://localhost/todos').then((res) => res.json()),
  ).toEqual([]);
  testTodosMock.reset();
  expect(
    await fetch('http://localhost/todos').then((res) => res.json()),
  ).toEqual(testTodos);
});
