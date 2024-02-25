import setupDashboard from './setupDashboard';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  createTestMock,
  createTestMockNoParametersAndNoData,
} from '../../../core/src/configureMock/configureMock.test-d';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { createTestScenario } from '../../../core/src/configureScenario/configureScenario.test-d';
import { http } from 'msw';

const nonDynamicHandler = http.get('/posts', () => {
  console.log('Captured a "GET /posts" request');
});

setupDashboard([
  createTestMock(),
  createTestMockNoParametersAndNoData(),
  createTestScenario(),
  nonDynamicHandler,
]);
