import { configureMock } from '@dynamic-msw/core';
import { HttpResponse, http } from 'msw';

export const createTestScenarioMock = configureMock(
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
    data: { some: 'data' },
  },
  (parameters, data) => {
    return [
      http.get('http://localhost/some-get-1', () => {
        return HttpResponse.json(parameters);
      }),
      http.get('http://localhost/some-get-data', () => {
        return HttpResponse.json(data);
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
