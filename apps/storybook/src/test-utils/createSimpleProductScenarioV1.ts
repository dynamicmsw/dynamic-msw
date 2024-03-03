// ? import from dynamic-msw in your app instead.
import { configureScenario } from '@dynamic-msw/core';
import { createFeatureFlagsMock } from './createFeatureFlagsMock';
import { createProductMocks, testProductsData } from './createProductMocks';

export const createSimpleProductScenarioV1 = configureScenario({
  key: 'simpleProductScenarioV1',
  mocks: [
    createFeatureFlagsMock({ parameters: { checkoutProcessVersion: 'v1' } }),
    createProductMocks({
      parameters: { availableStock: 10, canReview: false },
    }),
  ],
  dashboardConfig: {
    pageURL: `/products/${testProductsData.id}`,
  },
});
