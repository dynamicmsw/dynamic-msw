import type {
  State,
  MocksState,
  OptionType,
  OptionRenderType,
  ScenariosState,
} from '@dynamic-msw/core';
import { saveToStorage } from '@dynamic-msw/core';

export interface ConvertedMockOptions {
  type?: OptionRenderType;
  options?: OptionType[];
  title: string;
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
  const filteredMocks = mocks.filter(
    ({ dashboardScenarioOnly }) => !dashboardScenarioOnly
  );
  return filteredMocks.map(({ mockOptions, ...rest }) => {
    return {
      ...rest,
      mockOptions: Object.keys(mockOptions).map((optionKey) => {
        const { selectedValue, defaultValue } = mockOptions[optionKey];
        return {
          ...mockOptions[optionKey],
          title: optionKey,
          selectedValue:
            typeof selectedValue === 'undefined' ? defaultValue : selectedValue,
        };
      }),
    };
  });
};

const getScenarioMocks = (scenarios: ScenariosState[], mocks: MocksState[]) =>
  scenarios.map(({ mocks: mockIds, ...rest }) => ({
    ...rest,
    mocks: mockIds
      .map((mockId) => mocks.find(({ mockTitle }) => mockId === mockTitle))
      .filter(Boolean) as MocksState[],
  }));

export const convertScenarios = (
  scenarios: ScenariosState[],
  mocks: MocksState[]
) => {
  const scenariosWithMocks = getScenarioMocks(scenarios, mocks);
  return scenariosWithMocks.map(({ mocks, ...rest }) => ({
    ...rest,
    mocks: convertMockConfig(mocks),
  }));
};

export const updateConfig = (
  state: State,
  index: number,
  title: string,
  value: string | number | boolean
) => {
  const { mocks, scenarios } = state;
  const updatedConfig = [...mocks];
  updatedConfig[index] = {
    ...updatedConfig[index],
    mockOptions: {
      ...updatedConfig[index].mockOptions,
      [title]: { ...updatedConfig[index].mockOptions[title] },
    },
  };
  updatedConfig[index].mockOptions[title].selectedValue =
    value === 'true' ? true : value === 'false' ? false : value;

  saveToStorage({ mocks: updatedConfig, scenarios });
};

export const convertOptionValue = (value?: string | number | boolean) =>
  value === true || value === false ? value.toString() : value;

export const getInputType = (
  selectedValue?: OptionType,
  options?: OptionType[],
  type?: OptionRenderType
): OptionRenderType => {
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
  return typeof selectedValue as OptionRenderType;
};
