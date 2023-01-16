import type { DashboardItems } from './Dashboard.types';

export const getStorageKeys = (): DashboardItems[] => {
  const filteredKeys = getFlatStorageKeys().map((key) =>
    key.replace(/(^dynamic-msw\.)/, '').replace(/^__mock__\./, '')
  );
  const scenarioKeys = filteredKeys
    .filter((key) => key.startsWith('__scenario__.'))
    .sort();
  const mockKeys = filteredKeys.filter((key) => !scenarioKeys.includes(key));
  const mocks = mockKeys.map((key) => ({ title: key }));
  const groupedScenarioKeys = groupScenarioKeys(scenarioKeys);
  const scenarios = groupedScenarioKeys.map((scenario) => ({
    title: scenario[0],
    mocks: scenario[1],
  }));
  return [...mocks, ...scenarios].sort((a, b) =>
    a.title.localeCompare(b.title)
  );
};

export const getFlatStorageKeys = () => {
  const storageKeys = Object.keys(localStorage);
  return storageKeys.filter((key) => key.startsWith('dynamic-msw.'));
};

const groupScenarioKeys = (keys: string[]) =>
  keys.reduce<[string, string[]][]>((prev, curr) => {
    const prevIndex = prev.length - 1;
    const prevItem: [string, string[]] | undefined = prev[prevIndex];
    const currItemSplit = curr.split(/(__scenario__\.|\.__mock__\.)/);
    const scenarioTitle = currItemSplit[2];
    const mockTitle = currItemSplit[4];

    if (!mockTitle) return prev;

    if (prevItem && prevItem[0] === scenarioTitle) {
      prev[prevIndex][1].push(mockTitle);
      return prev;
    }
    const newEntry: [string, string[]] = [scenarioTitle, [mockTitle]];
    return [...prev, newEntry];
  }, []);
