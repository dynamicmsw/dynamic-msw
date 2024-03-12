import { HttpResponse, http } from 'msw';
import configureMock from '../configureMock/configureMock';

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
  ({ getParams, getData }) => {
    return [
      http.get('http://localhost/some-get-1', () => {
        return HttpResponse.json(getParams());
      }),
      http.get('http://localhost/some-get-data', () => {
        return HttpResponse.json(getData());
      }),
      http.get(
        'http://localhost/get-once-dynamic-1',
        () => {
          return HttpResponse.json({ onceResponse: true });
        },
        { once: true },
      ),
    ];
  },
);
