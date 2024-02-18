import {
  DashboardDisplayFilter,
  ScenarioOrMockKey,
  selectDisplayFilter,
  selectOrderedScenariosAndMocks,
  selectSearchQuery,
  useTypedSelector,
} from '@dynamic-msw/core';
import { useMemo } from 'react';
import Fuse from 'fuse.js';

export function useFilteredMocksAndScenarios() {
  const mocksAndScenarios = useTypedSelector(selectOrderedScenariosAndMocks);
  const searchQuery = useTypedSelector(selectSearchQuery);
  const displayFilter = useTypedSelector(selectDisplayFilter);
  const fuse = useMemo(
    () =>
      new Fuse<ScenarioOrMockKey>(mocksAndScenarios, {
        keys: ['mockKey', 'scenarioKey', 'search'],
        includeScore: false,
        shouldSort: false,
        threshold: 0.3,
      }),
    [mocksAndScenarios]
  );
  return (
    searchQuery
      ? fuse.search(searchQuery).map((value) => value.item)
      : mocksAndScenarios
  ).filter(filterBasedOnDisplayFilter(displayFilter));
}

function filterBasedOnDisplayFilter(displayFilter: DashboardDisplayFilter) {
  return (item: ScenarioOrMockKey) => {
    switch (displayFilter) {
      case 'mocks':
        return item.mockKey ? true : false;
      case 'scenarios':
        return item.scenarioKey ? true : false;
      default:
        return true;
    }
  };
}
