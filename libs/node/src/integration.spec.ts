import { expect, test, afterEach } from 'vitest';
import { HttpResponse, http } from 'msw';
import { createMock, createScenario } from '@dynamic-msw/core';
import setupServer from './lib/setupServer';

const getTestMock = createMock(
  {
    key: 'testMock',
    parameters: {
      string: 'test-string',
      number: 1,
      boolean: true,
      nullableStringWithoutDefault: {
        dashboardInputType: 'string',
        nullable: true,
      },
      stringWithInputTypeAndDefaultValue: {
        dashboardInputType: 'string',
        defaultValue: 'test-string-default-value',
      },
    },
  },
  (parameters) => {
    return [
      http.get('http://localhost/some-get', () => {
        return HttpResponse.json(parameters);
      }),
      http.get(
        'http://localhost/get-once-dynamic',
        () => {
          return HttpResponse.json({ onceResponse: true });
        },
        { once: true }
      ),
    ];
  }
);
const getTestScenarioMock = createMock(
  {
    key: 'testScenarioMock',
    parameters: {
      string: 'test-string',
      number: 1,
      boolean: true,
      nullableStringWithoutDefault: {
        dashboardInputType: 'string',
        nullable: true,
      },
      stringWithInputTypeAndDefaultValue: {
        dashboardInputType: 'string',
        defaultValue: 'test-string-default-value',
      },
    },
  },
  (parameters) => {
    return [
      http.get('http://localhost/some-get-1', () => {
        return HttpResponse.json(parameters);
      }),
      http.get(
        'http://localhost/get-once-dynamic-1',
        () => {
          return HttpResponse.json({ onceResponse: true });
        },
        { once: true }
      ),
    ];
  }
);

const testMock = getTestMock();
const testScenarioMock = getTestScenarioMock();

const testScenario = createScenario({
  key: 'someScenario',
  mocks: [testScenarioMock],
});

const initialParameters = {
  string: 'test-string',
  number: 1,
  boolean: true,
  nullableStringWithoutDefault: null,
  stringWithInputTypeAndDefaultValue: 'test-string-default-value',
};

const server = setupServer(
  testScenario,
  testMock,
  http.get(
    'http://localhost/get-once',
    () => {
      return HttpResponse.json({ onceResponseNonDynamic: true });
    },
    { once: true }
  )
);
server.listen();

afterEach(() => {
  server.resetHandlers();
});

test('Updates dynamic mocks and resets properly', async () => {
  expect(
    await fetch('http://localhost/some-get-1').then((res) => res.json())
  ).toEqual(initialParameters);
  const updatedString1 = 'updated-string';
  testScenario.updateParameters({
    testScenarioMock: { string: updatedString1 },
  });
  expect(
    await fetch('http://localhost/some-get-1').then((res) => res.json())
  ).toEqual({ ...initialParameters, string: updatedString1 });
  expect(
    await fetch('http://localhost/some-get').then((res) => res.json())
  ).toEqual(initialParameters);
  const updatedString = 'updated-string';
  testMock.updateParameters({ string: updatedString });
  expect(
    await fetch('http://localhost/some-get').then((res) => res.json())
  ).toEqual({ ...initialParameters, string: updatedString });
  server.resetHandlers();
  expect(
    await fetch('http://localhost/some-get-1').then((res) => res.json())
  ).toEqual(initialParameters);
  testScenario.updateParameters({
    testScenarioMock: { string: updatedString },
  });
  expect(
    await fetch('http://localhost/some-get-1').then((res) => res.json())
  ).toEqual({ ...initialParameters, string: updatedString });
  testScenarioMock.reset();
  expect(
    await fetch('http://localhost/some-get-1').then((res) => res.json())
  ).toEqual(initialParameters);
});

test('Does not consider an previously called HttpResponse called after updating paramaters', async () => {
  expect(
    await fetch('http://localhost/get-once-dynamic-1').then((res) => res.json())
  ).toEqual({ onceResponse: true });
  const updatedString = 'updated-string';
  testScenario.updateParameters({
    testScenarioMock: { string: updatedString },
  });
  expect(
    fetch('http://localhost/get-once-dynamic-1').then((res) => res.json())
  ).rejects.toThrow();
});

test('Considers an non-dynamic and dynamic HttpResponse un-called after `server.resetHandlers` is called', async () => {
  expect(
    await fetch('http://localhost/get-once-dynamic-1').then((res) => res.json())
  ).toEqual({ onceResponse: true });
  expect(
    await fetch('http://localhost/get-once').then((res) => res.json())
  ).toEqual({ onceResponseNonDynamic: true });
  server.resetHandlers();
  expect(
    await fetch('http://localhost/get-once-dynamic-1').then((res) => res.json())
  ).toEqual({ onceResponse: true });
  expect(
    await fetch('http://localhost/get-once').then((res) => res.json())
  ).toEqual({ onceResponseNonDynamic: true });
});
test('Considers an non-dynamic and dynamic HttpResponse un-called after `server.resetHandlers` is called', async () => {
  expect(
    await fetch('http://localhost/get-once-dynamic-1').then((res) => res.json())
  ).toEqual({ onceResponse: true });
  expect(
    await fetch('http://localhost/get-once').then((res) => res.json())
  ).toEqual({ onceResponseNonDynamic: true });
  server.resetHandlers();
  expect(
    await fetch('http://localhost/get-once-dynamic-1').then((res) => res.json())
  ).toEqual({ onceResponse: true });
  expect(
    await fetch('http://localhost/get-once').then((res) => res.json())
  ).toEqual({ onceResponseNonDynamic: true });
});
