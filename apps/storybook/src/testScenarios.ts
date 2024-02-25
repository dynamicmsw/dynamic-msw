import { configureScenario } from '@dynamic-msw/core';
import { createTestScenarioMock, createTestScenarioMock2 } from './testMocks';

export const createTestScenario = configureScenario({
  key: 'someScenario',
  mocks: [createTestScenarioMock()],
  dashboardConfig: { pageURL: 'test-scenario', title: 'Test scenario title' },
});
export const createTestScenario2 = configureScenario({
  key: 'someScenario2',
  mocks: [createTestScenarioMock2()],
  dashboardConfig: { pageURL: 'test-scenario2' },
});
export const createTestScenario3 = configureScenario({
  key: 'someScenario3',
  mocks: [createTestScenarioMock2(), createTestScenarioMock()],
  dashboardConfig: { pageURL: 'test-scenario2' },
});
