import { setupDashboard } from '@dynamic-msw/browser';
import { createMock, createScenario } from '@dynamic-msw/core';
import { HttpResponse, http } from 'msw';
import { useEffect, useState } from 'react';

const testMock = createMock(
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
      selectOptions: {
        selectOptions: ['test', true, 'true'],
        defaultValue: 'true',
      },
    },
    dashboardConfig: { pageURL: 'test', title: 'Test mock title' },
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
const testScenarioMock = createMock(
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
    dashboardConfig: {
      pageURL: 'http://localhost:1234',
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
const testScenarioMock2 = createMock(
  {
    key: 'testScenarioMock2',
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
      selectOptions: {
        selectOptions: ['test', true, 'true'],
        defaultValue: 'true',
      },
    },
    dashboardConfig: {
      pageURL: 'http://localhost:1234',
    },
  },
  () => {
    return [];
  }
);

const testScenario = createScenario({
  key: 'someScenario',
  mocks: [testScenarioMock],
  dashboardConfig: { pageURL: 'test-scenario', title: 'Test scenario title' },
});
const testScenario2 = createScenario({
  key: 'someScenario2',
  mocks: [testScenarioMock2],
  dashboardConfig: { pageURL: 'test-scenario2' },
});
const testScenario3 = createScenario({
  key: 'someScenario3',
  mocks: [testScenarioMock2, testScenarioMock],
  dashboardConfig: { pageURL: 'test-scenario2' },
});

const setup = setupDashboard([
  testScenarioMock2,
  testMock,
  testScenario,
  testScenario3,
  testScenario2,
  testScenarioMock2,
  testScenarioMock,
]);

// ? ensures that mocks are initialized on first render
export default function useSetupStoryDashboard() {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    setup.start();
    // ? Give it some time to populate local storage
    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => {
      clearTimeout(timeout);
      setup.stop();
    };
  }, []);
  return { isReady };
}
