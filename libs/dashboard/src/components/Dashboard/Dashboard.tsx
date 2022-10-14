import {
  Table,
  TableRow,
  TableCell,
  ExpansionPanel,
  Button,
  SelectInput,
  TextInput,
  ToggleInput,
  ExpansionPanelContextProvider,
  Spacing,
  Stack,
} from '@stela-ui/react';
import type { FC } from 'react';

import {
  convertMockConfig,
  getInputType,
  updateConfig,
  convertOptionValue,
} from './Dashboard.helpers';
import { useGetMockConfig } from './useGetMockConfig';

/* eslint-disable-next-line */
export interface DashboardProps {}

export const Dashboard: FC<DashboardProps> = () => {
  const { mockConfig, isLoading, iFrameError } = useGetMockConfig();
  const convertedMockConfig = mockConfig ? convertMockConfig(mockConfig) : [];

  return (
    <div>
      <h1>Dynamic MSW Dashboard</h1>
      {isLoading && <h4>Loading mock config...</h4>}
      {iFrameError && <h4>{iFrameError}</h4>}

      <Table columns={3}>
        <ExpansionPanelContextProvider>
          {convertedMockConfig.map(
            ({ scenarioTitle, mockOptions, openPageURL }, index) => (
              <div
                key={scenarioTitle}
                css={{
                  display: 'contents',
                  '> * > *, summary': { display: 'flex', alignItems: 'center' },
                  '&:nth-child(odd) div, &:nth-child(odd) summary, &:nth-child(odd) details':
                    {
                      background: '#f9f9f9',
                    },
                  '&:nth-child(even) div, &:nth-child(even) summary,  &:nth-child(even) details':
                    {
                      background: '#ededed',
                    },
                }}
              >
                <TableRow>
                  <TableCell>
                    <Spacing pl={2}>
                      <h4>{scenarioTitle}</h4>
                    </Spacing>
                  </TableCell>

                  {mockOptions.length >= 0 ? (
                    <ExpansionPanel title="Configure" contextId={scenarioTitle}>
                      <TableCell row={index + 2} columnStart={1} columnEnd={4}>
                        <Spacing px={2} pb={3}>
                          <Stack gap={3}>
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
                                  updateConfig(
                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                    mockConfig!,
                                    index,
                                    title,
                                    inputType === 'number'
                                      ? Number(value)
                                      : value
                                  );
                                };
                                const defaultValue =
                                  convertOptionValue(selectedValue);
                                switch (inputType) {
                                  case 'select':
                                    return (
                                      <SelectInput
                                        key={optionId}
                                        name={optionId}
                                        label={title}
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
                                        key={optionId}
                                        label={title}
                                        type={inputType}
                                        defaultValue={defaultValue}
                                        onChange={onChangeHandler}
                                      />
                                    );
                                  case 'boolean':
                                    return (
                                      <ToggleInput
                                        key={optionId}
                                        label={title}
                                        defaultChecked={defaultValue === 'true'}
                                        onChange={onChangeHandler}
                                      />
                                    );
                                  default:
                                    return null;
                                }
                              }
                            )}
                          </Stack>
                        </Spacing>
                      </TableCell>
                    </ExpansionPanel>
                  ) : (
                    <TableCell>
                      <h5>no options</h5>
                    </TableCell>
                  )}

                  {openPageURL ? (
                    <TableCell>
                      <Spacing pr={2} css={{ textAlign: 'right' }}>
                        <a href={openPageURL} target="_blank" rel="noreferrer">
                          <Button>Open page</Button>
                        </a>
                      </Spacing>
                    </TableCell>
                  ) : (
                    <TableCell>
                      <div />
                    </TableCell>
                  )}
                </TableRow>
              </div>
            )
          )}
        </ExpansionPanelContextProvider>
      </Table>
    </div>
  );
};

export default Dashboard;
