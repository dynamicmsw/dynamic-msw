import type { CreateMockFnReturnType, OptionType } from './createMock.types';
import { state } from './state';

// TODO: figure out if something like this is possible
// <
//   B extends CreateMockFnReturnType,
//   T extends { mock: B; options: B['mockOptions'] }[]
// >

export const createScenario = (
  scenarioTitle: string,
  mocks: {
    mock: CreateMockFnReturnType;
    options: Record<string, OptionType>;
  }[]
) => {
  // TODO: temp solution to use until proper type checking is implemented
  mocks.forEach(({ mock, options }) => {
    const optionsKeys = Object.keys(options);
    const mockOptionsKeys = Object.keys(mock.mockOptions);
    optionsKeys.forEach((key) => {
      if (!mockOptionsKeys.includes(key)) {
        throw Error('Passed an unknown object key to createScenario: ' + key);
      }
    });
  });
  const updatedMocks = mocks.map(({ mock, options }) => {
    return {
      mock: mock.updateMock(options, true),
      options,
    };
  });
  return state.addScenario({
    scenarioTitle,
    mocks: updatedMocks.map(({ mock }) => mock),
  });
};
