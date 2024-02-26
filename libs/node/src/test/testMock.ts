import { configureMock } from '@dynamic-msw/core';
import { HttpResponse, http } from 'msw';

export const createTestMock = configureMock(
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
