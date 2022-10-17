import type { CreateMockFnReturnType } from './createMock.types';
import { state } from './state';

export const createScenario = (
  scenarioTitle: string,
  mocks: CreateMockFnReturnType[]
) => {
  state.addScenario({
    scenarioTitle,
    mocks: mocks.map(({ mockTitle }) => mockTitle),
  });
};
