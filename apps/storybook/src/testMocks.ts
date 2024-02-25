import { createMock } from '@dynamic-msw/core';
import { HttpResponse, http } from 'msw';

export const getTestMock = createMock(
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
  (parameters) => [
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
  ]
);
export const getTestScenarioMock = createMock(
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
export const getTestScenarioMock2 = createMock(
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
