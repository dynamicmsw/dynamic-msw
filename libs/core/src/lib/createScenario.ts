import type { CreateMockFnReturnType } from './createMock.types';
import { state } from './state';

export const createScenario = (
  scenarioTitle: string,
  mocks: CreateMockFnReturnType[]
) => {
  const currentState = state.getState();
  const foundMocks = mocks.map(({ mockTitle }) =>
    currentState.mocks.find((data) => mockTitle === data.mockTitle)
  );

  return state.addScenario({
    scenarioTitle,
    mocks: foundMocks,
  });
};
