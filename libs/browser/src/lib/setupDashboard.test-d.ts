import setupDashboard from './setupDashboard';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  testMock,
  testMockNoParametersAndNoData,
} from '../../../core/src/createMock/createMock.test-d';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { testScenario } from '../../../core/src/createScenario/createScenario.test-d';
import { http } from 'msw';

const nonDynamicHandler = http.get('/posts', () => {
  console.log('Captured a "GET /posts" request');
});

setupDashboard([
  testMock,
  testMockNoParametersAndNoData,
  testScenario,
  nonDynamicHandler,
]);
