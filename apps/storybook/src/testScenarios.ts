import { createScenario } from '@dynamic-msw/core';
import { getTestScenarioMock, getTestScenarioMock2 } from './testMocks';

export const getTestScenario = createScenario({
  key: 'someScenario',
  mocks: [getTestScenarioMock()],
  dashboardConfig: { pageURL: 'test-scenario', title: 'Test scenario title' },
});
export const getTestScenario2 = createScenario({
  key: 'someScenario2',
  mocks: [getTestScenarioMock2()],
  dashboardConfig: { pageURL: 'test-scenario2' },
});
export const getTestScenario3 = createScenario({
  key: 'someScenario3',
  mocks: [getTestScenarioMock2(), getTestScenarioMock()],
  dashboardConfig: { pageURL: 'test-scenario2' },
});
