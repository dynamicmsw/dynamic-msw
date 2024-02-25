import { setupDashboard } from '@dynamic-msw/browser';
import { useEffect, useState } from 'react';
import {
  getTestMock,
  getTestScenarioMock,
  getTestScenarioMock2,
} from './testMocks';
import { getTestScenario2, getTestScenario3 } from './testScenarios';

const setup = setupDashboard([
  getTestScenarioMock2(),
  getTestMock(),
  getTestScenarioMock2(),
  getTestScenario3(),
  getTestScenario2(),
  getTestScenarioMock2(),
  getTestScenarioMock(),
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
