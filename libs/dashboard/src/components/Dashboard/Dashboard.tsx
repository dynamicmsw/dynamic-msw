import type { MocksState } from '@dynamic-msw/core';
import { loadFromStorage, saveToStorage } from '@dynamic-msw/core';

/* eslint-disable-next-line */
export interface DashboardProps {}

const convertMockConfig = (mocks: MocksState[]) => {
  if (mocks.length < 0) {
    throw Error('No mocks found');
  }
  return mocks.map(({ mockOptions, ...rest }) => {
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

export function Dashboard(props: DashboardProps) {
  const mockConfig = loadFromStorage();
  const convertedMockConfig = convertMockConfig(mockConfig);

  return (
    <div>
      <h1>Welcome to Dashboard!</h1>
      {convertedMockConfig.map(({ scenarioTitle, mockOptions }, index) => (
        <div key={scenarioTitle}>
          <h1>{scenarioTitle}</h1>
          {mockOptions.map(({ selectedValue, options, title }) => (
            <div key={title}>
              <select
                name={`${scenarioTitle}-${title}`}
                onChange={(e) => {
                  const { value } = e.currentTarget;
                  const updatedConfig = [...mockConfig];
                  updatedConfig[index] = {
                    ...updatedConfig[index],
                    mockOptions: { ...updatedConfig[index].mockOptions },
                  };
                  updatedConfig[index].mockOptions[title].selectedValue =
                    value === 'true' ? true : value === 'false' ? false : value;

                  saveToStorage(updatedConfig);
                }}
              >
                {options?.map((value) => (
                  <option
                    value={
                      value === true || value === false
                        ? value.toString()
                        : value
                    }
                    selected={value === selectedValue}
                  >
                    {value.toString()}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
