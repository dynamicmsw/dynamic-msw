import { convertMockOptions } from './createMock';
import type { CreateMockFnReturnType, OptionType } from './createMock.types';
import type { State } from './state';
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
  }[],
  options: {
    //TODO: add function
    openPageURL?: string;
  } = {}
) => {
  // TODO: temp solution to use until proper type checking is implemented
  mocks.forEach(({ mock, options: mockOptions }) => {
    const optionsKeys = Object.keys(mockOptions);
    const mockOptionsKeys = Object.keys(mock.mockOptions);
    optionsKeys.forEach((key) => {
      if (!mockOptionsKeys.includes(key)) {
        throw Error('Passed an unknown object key to createScenario: ' + key);
      }
    });
  });
  const initialState = state.getState();
  const initialScenarioIndex = initialState.scenarios.findIndex(
    (scenario) => scenario.scenarioTitle === scenarioTitle
  );

  const updateMocks = (initialScenarioIndex?: number) =>
    mocks.map(({ mock, options: mockOptions }, index) => {
      const initialMockOptions =
        initialScenarioIndex >= 0
          ? convertMockOptions(
              initialState.scenarios[initialScenarioIndex].mocks[index]
                .mockOptions
            )
          : mockOptions;
      return {
        mock: mock.updateMock(initialMockOptions, true),
        options: initialMockOptions,
      };
    });
  const scenarioData = {
    ...options,
    isActive: initialState.scenarios[initialScenarioIndex]?.isActive,
    scenarioTitle,
    mocks: updateMocks(initialScenarioIndex).map(({ mock }) => mock),
    resetMock: () => {
      scenarioData.mocks = updateMocks().map(({ mock }) => mock);
      state.updateScenario(scenarioData);
      if (initialState.scenarios[initialScenarioIndex]?.isActive) {
        global.__mock_worker?.use(
          ...scenarioData.mocks.flatMap(({ mocks }) => mocks)
        );
      }
    },
  };

  if (initialState.scenarios[initialScenarioIndex]?.isActive) {
    global.__mock_worker?.use(
      ...scenarioData.mocks.flatMap(({ mocks }) => mocks)
    );
  }
  state.addScenario(scenarioData);
  return scenarioData;
};
