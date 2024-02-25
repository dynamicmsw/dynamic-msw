import { setupDashboard } from '@dynamic-msw/browser';
import { useEffect, useState } from 'react';
import {
  createTestMock,
  createTestScenarioMock,
  createTestScenarioMock2,
} from './testMocks';
import { createTestScenario2, createTestScenario3 } from './testScenarios';

const setup = setupDashboard([
  createTestScenarioMock2(),
  createTestMock(),
  createTestScenarioMock2(),
  createTestScenario3(),
  createTestScenario2(),
  createTestScenarioMock2(),
  createTestScenarioMock(),
]);

// ? ensures that mocks are initialized on first render
export default function useSetupStoryDashboard() {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    setup.start();
    // ? Give it some time to populate local storage
    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => {
      clearTimeout(timeout);
      setup.stop();
    };
  }, []);
  return { isReady };
}
