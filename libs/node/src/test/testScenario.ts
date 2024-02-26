import { configureScenario } from '@dynamic-msw/core';
import { createTestScenarioMock } from './testScenarioMock';
export const testScenarioMock = createTestScenarioMock();
export const createScenario = configureScenario({
  key: 'someScenario',
  mocks: [testScenarioMock],
});
