import type {
  State,
  MocksState,
  OptionType,
  OptionRenderType,
  ScenariosState,
  ScenarioMockOptionsState,
} from '@dynamic-msw/core';
import { saveToStorage } from '@dynamic-msw/core';

export interface ConvertedMockOptions {
  type?: OptionRenderType;
  options?: OptionType[];
  title: string;
  key: string;
  defaultValue?: OptionType;
  selectedValue?: OptionType;
}

export interface ConvertMockConfigReturnType
  extends Omit<MocksState, 'mockOptions'> {
  mockOptions: ConvertedMockOptions[];
}

export const convertMockConfig = (
  mocks: MocksState[]
): ConvertMockConfigReturnType[] => {
  if (mocks.length < 0) {
    throw Error('No mocks found');
  }
  return mocks
    .filter(({ isUsedInSetup }) => isUsedInSetup)
    .map(({ mockOptions, ...rest }) => {
      return {
        ...rest,
        mockOptions: Object.keys(mockOptions).map((optionKey) => {
          const { selectedValue, defaultValue, optionTitle } =
            mockOptions[optionKey];
          return {
            ...mockOptions[optionKey],
            key: optionKey,
            title: optionTitle || optionKey,
            selectedValue:
              typeof selectedValue === 'undefined'
                ? defaultValue
                : selectedValue,
          };
        }),
      };
    });
};

export const convertScenarioMockConfig = (
  mocks: ScenarioMockOptionsState[]
) => {
  if (mocks.length < 0) {
    throw Error('No mocks found');
  }
  return mocks.map(({ mockOptions, ...rest }) => {
    return {
      ...rest,
      mockOptions: Object.keys(mockOptions).map((optionKey) => {
        const { selectedValue, defaultValue, optionTitle } =
          mockOptions[optionKey];
        return {
          ...mockOptions[optionKey],
          key: optionKey,
          title: optionTitle || optionKey,
          selectedValue:
            typeof selectedValue === 'undefined' ? defaultValue : selectedValue,
        };
      }),
    };
  });
};

export const convertScenarios = (scenarios: ScenariosState[]) => {
  return scenarios.map(({ mocks, ...rest }) => ({
    ...rest,
    mocks: convertScenarioMockConfig(mocks),
  }));
};

export const updateMockOptions = (
  state: State,
  mockTitle: string,
  title: string,
  value: string | number | boolean
) => {
  const { mocks, scenarios } = state;

  const findIndex = mocks.findIndex((data) => data.mockTitle === mockTitle);
  mocks[findIndex].mockOptions[title].selectedValue =
    value === 'true' ? true : value === 'false' ? false : value;
  const updatedState = { mocks, scenarios };
  saveToStorage(updatedState);
  return updatedState;
};

export const updateScenarioOptions = (
  state: State,
  scenarioTitle: string,
  mocksIndex: number,
  title: string,
  value: string | number | boolean
) => {
  const { mocks, scenarios } = state;
  const scenarioIndex = scenarios.findIndex(
    (data) => data.scenarioTitle === scenarioTitle
  );
  scenarios[scenarioIndex].mocks[mocksIndex].mockOptions[title].selectedValue =
    value === 'true' ? true : value === 'false' ? false : value;
  const updatedState = { mocks, scenarios };
  saveToStorage(updatedState);
  return updatedState;
};

const resetScenarioOptions = (state: State) => {
  const { mocks, scenarios } = state;
  const clonedConfig: State['scenarios'] = JSON.parse(
    JSON.stringify(scenarios)
  );

  clonedConfig.forEach(({ mocks }, index) => {
    mocks.forEach(({ mockOptions }, mockIndex) => {
      Object.keys(mockOptions).forEach((key) => {
        delete clonedConfig[index].mocks[mockIndex].mockOptions[key]
          .selectedValue;
      });
    });
  });

  saveToStorage({ mocks, scenarios: clonedConfig });
  return clonedConfig;
};
const resetMockOptions = (state: State) => {
  const { mocks, scenarios } = state;
  const clonedConfig: State['mocks'] = JSON.parse(JSON.stringify(mocks));

  clonedConfig.forEach(({ mockOptions }, index) => {
    Object.keys(mockOptions).forEach((key) => {
      delete clonedConfig[index].mockOptions[key].selectedValue;
    });
  });

  saveToStorage({ mocks: clonedConfig, scenarios });
  return clonedConfig;
};

export const resetAll = (state: State) => {
  const resetState = {
    scenarios: resetScenarioOptions(state),
    mocks: resetMockOptions(state),
  };
  saveToStorage(resetState);
  return resetState;
};

export const convertOptionValue = (value?: string | number | boolean) =>
  value === true || value === false ? value.toString() : value;

export const getInputType = (
  defaultValue?: OptionType,
  selectedValue?: OptionType,
  options?: OptionType[],
  type?: OptionRenderType
): OptionRenderType | 'select' => {
  if (type) return type;
  if (
    options &&
    options.length >= 0 &&
    options.filter((option) => option === true || option === false).length ===
      options.length
  ) {
    return 'boolean';
  }
  if (options) return 'select';
  return (
    selectedValue ? typeof selectedValue : typeof defaultValue
  ) as OptionRenderType;
};

export const isMockActive = (state: State, mockTitle: string) => {
  const activeScenario = state.scenarios?.find(({ isActive }) => isActive);

  return Boolean(
    activeScenario
      ? activeScenario.mocks.find((data) => mockTitle === data.mockTitle)
      : true
  );
};
