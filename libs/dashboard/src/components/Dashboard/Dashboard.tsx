import type {
  MocksState,
  OptionType,
  OptionRenderType,
} from '@dynamic-msw/core';
import { loadFromStorage, saveToStorage } from '@dynamic-msw/core';
import {
  Table,
  TableRow,
  TableCell,
  ExpansionPanel,
  Button,
  SelectInput,
  TextInput,
  ToggleInput,
  // ExpansionPanelContext
} from '@stela-ui/react';

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

const updateConfig = (
  mockConfig: MocksState[],
  index: number,
  title: string,
  value: string | number | boolean
) => {
  const updatedConfig = [...mockConfig];
  updatedConfig[index] = {
    ...updatedConfig[index],
    mockOptions: {
      ...updatedConfig[index].mockOptions,
    },
  };
  updatedConfig[index].mockOptions[title].selectedValue =
    value === 'true' ? true : value === 'false' ? false : value;

  saveToStorage(updatedConfig);
};

const convertOptionValue = (value?: string | number | boolean) =>
  value === true || value === false ? value.toString() : value;

const getInputType = (
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

export const Dashboard = (props: DashboardProps) => {
  const mockConfig = loadFromStorage();
  const convertedMockConfig = convertMockConfig(mockConfig);

  return (
    <div>
      <h1>Welcome to Dashboard!</h1>
      <Table columns={3}>
        {convertedMockConfig.map(
          ({ scenarioTitle, mockOptions, openPageURL }, index) => (
            <TableRow key={scenarioTitle}>
              <TableCell>
                <h4>{scenarioTitle}</h4>
              </TableCell>

              {mockOptions.length >= 0 ? (
                <ExpansionPanel title="Configure">
                  <TableCell row={index + 2} columnStart={1} columnEnd={4}>
                    {mockOptions.map(
                      ({ selectedValue, options, type, title }) => {
                        const optionId = `${scenarioTitle}-${title}`;
                        const inputType = getInputType(
                          selectedValue,
                          options,
                          type
                        );
                        const onChangeHandler = (
                          value: string | number | boolean
                        ) => {
                          updateConfig(mockConfig, index, title, value);
                        };
                        const defaultValue = convertOptionValue(selectedValue);
                        switch (inputType) {
                          case 'select':
                            return (
                              <SelectInput
                                key={optionId}
                                // name={optionId}
                                label={optionId}
                                defaultValue={defaultValue}
                                onChange={onChangeHandler}
                                options={
                                  options?.map((value) => ({
                                    value:
                                      convertOptionValue(value) ||
                                      'value not specified',
                                  })) || []
                                }
                              />
                            );
                          case 'text':
                          case 'number':
                            return (
                              <TextInput
                                // label={optionId}
                                type={type as 'text' | 'number'}
                                defaultValue={defaultValue}
                                onChange={onChangeHandler}
                              />
                            );
                          case 'boolean':
                            return (
                              <ToggleInput
                                label={optionId}
                                defaultChecked={defaultValue === 'true'}
                                onChange={onChangeHandler}
                              />
                            );
                          default:
                            return null;
                        }
                      }
                    )}
                  </TableCell>
                </ExpansionPanel>
              ) : (
                <TableCell>
                  <h5>no options</h5>
                </TableCell>
              )}

              {openPageURL ? (
                <TableCell>
                  <a href={openPageURL} target="_blank" rel="noreferrer">
                    <Button>Open page</Button>
                  </a>
                </TableCell>
              ) : (
                <div />
              )}
            </TableRow>
          )
        )}
      </Table>
    </div>
  );
};

export default Dashboard;
