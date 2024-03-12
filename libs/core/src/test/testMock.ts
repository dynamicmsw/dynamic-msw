import { HttpResponse, http } from 'msw';
import configureMock from '../configureMock/configureMock';

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
  ({ getParams }) => {
    return [
      http.get('http://localhost/some-get', () => {
        return HttpResponse.json(getParams());
      }),
      http.get(
        'http://localhost/get-once-dynamic',
        () => {
          return HttpResponse.json({ onceResponse: true });
        },
        { once: true },
      ),
    ];
  },
);
