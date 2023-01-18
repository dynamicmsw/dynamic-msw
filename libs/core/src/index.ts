export { createMock } from './lib/createMock/createMock';
export type {
  CreateMock,
  CreateMockReturnType,
} from './lib/createMock/createMock';
export { createStorageKey } from './lib/createMock/createMock.helpers';
export * from './lib/createMock/createMock.types';

export { createScenario } from './lib/createScenario/createScenario';
export {
  createScenarioKey,
  createScenarioMockKey,
} from './lib/createScenario/createScenario.helpers';
export type {
  CreateScenario,
  CreateScenarioReturnType,
} from './lib/createScenario/createScenario';
export * from './lib/createScenario/createScenario.types';

export { setupWorker } from './lib/setup/setupWorker';
export type { SetupWorkerApi } from './lib/setup/setupWorker';

export type { Config, SetupServerOrWorker } from './lib/types';

export { loadFromStorage, saveToStorage } from './lib/storage/storage';
