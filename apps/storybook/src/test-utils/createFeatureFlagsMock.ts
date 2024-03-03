import { configureMock } from 'dynamic-msw';
import { HttpResponse, http } from 'msw';
import { createApiURL } from './createApiURL';

export const createFeatureFlagsMock = configureMock(
  {
    key: 'featureFlags', // unique key
    parameters: {
      checkoutProcessVersion: {
        selectOptions: ['v1', 'v2'] as const,
        defaultValue: 'v1',
      },
    },
  },
  ({ checkoutProcessVersion }) => {
    return http.get(createApiURL('/feature-flags'), () => {
      return HttpResponse.json({ checkoutProcessVersion });
    });
  }
);
