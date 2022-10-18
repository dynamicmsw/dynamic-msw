import { saveToStorage, defaultState } from '@dynamic-msw/core';
import {
  Table,
  Button,
  ExpansionPanelContextProvider,
  Stack,
} from '@stela-ui/react';
import type { FC } from 'react';

import {
  convertMockConfig,
  convertScenarios,
  updateMockOptions,
  getInputType,
} from './Dashboard.helpers';
import { MockOptionsInput } from './MockOptionsInput';
import { OptionsTableRow } from './OptionsTableRow';
import { useGetMockConfig } from './useGetMockConfig';

/* eslint-disable-next-line */
export interface DashboardProps {}

export const Dashboard: FC<DashboardProps> = () => {
  const { mockConfig, isLoading, iFrameError } = useGetMockConfig();
  const convertedMockConfig = mockConfig
    ? convertMockConfig(mockConfig.mocks)
    : [];
  const convertedScenarios = mockConfig
    ? convertScenarios(mockConfig.scenarios)
    : [];

  return (
    <Stack gap={4}>
      <h1>Dynamic MSW Dashboard</h1>
      {isLoading && (
        <h4 data-testid="dashboard-state">Loading mock config...</h4>
      )}
      {iFrameError && <h4 data-testid="dashboard-state">{iFrameError}</h4>}

      <Table columns={3} css={{ width: '100%' }}>
        <ExpansionPanelContextProvider>
          <div
            css={{
              // TODO: fix this way of styling the table rows.
              // TODO: This should be possible from the stela-ui lib for starters
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
            {convertedMockConfig.map(
              ({ mockTitle, mockOptions, openPageURL }, index) => (
                <OptionsTableRow
                  key={mockTitle}
                  rowTitle={mockTitle}
                  index={index}
                  hasMockOptions={mockOptions.length >= 0}
                  openPageURL={openPageURL}
                >
                  {mockOptions.map(
                    ({ selectedValue, options, type, title }) => {
                      const inputType = getInputType(
                        selectedValue,
                        options,
                        type
                      );
                      return (
                        <MockOptionsInput
                          key={`${mockTitle}-${title}`}
                          id={`${mockTitle}-${title}`}
                          title={title}
                          options={options}
                          selectedValue={selectedValue}
                          inputType={inputType}
                          onChange={(value) => {
                            updateMockOptions(
                              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                              mockConfig!,
                              index,
                              title,
                              inputType === 'number' ? Number(value) : value
                            );
                          }}
                        />
                      );
                    }
                  )}
                </OptionsTableRow>
              )
            )}
            {convertedScenarios.map(
              ({ scenarioTitle, mocks, openPageURL }, index) => (
                <>
                  <OptionsTableRow
                    key={`${scenarioTitle}`}
                    rowTitle={scenarioTitle}
                    index={index + convertedMockConfig.length}
                    hasMockOptions={Boolean(
                      mocks.find(({ mockOptions }) => mockOptions.length >= 0)
                    )}
                    openPageURL={openPageURL}
                  >
                    {mocks.map(({ mockTitle, mockOptions }) => (
                      <>
                        <h4 css={{ margin: 0 }}>{mockTitle}</h4>
                        {mockOptions.map(
                          ({ selectedValue, options, type, title }) => {
                            const inputType = getInputType(
                              selectedValue,
                              options,
                              type
                            );
                            return (
                              <MockOptionsInput
                                key={`${scenarioTitle}-${mockTitle}-${title}`}
                                id={`${scenarioTitle}-${mockTitle}-${title}`}
                                title={title}
                                options={options}
                                selectedValue={selectedValue}
                                onChange={(value) => {
                                  //
                                }}
                                inputType={inputType}
                              />
                            );
                          }
                        )}
                      </>
                    ))}
                  </OptionsTableRow>
                </>
              )
            )}
          </div>
        </ExpansionPanelContextProvider>
      </Table>
      <Button
        data-testid="reset-all-mocks-button"
        onClick={() => {
          // TODO: this will require the iframe method of loading in createMock it's storage.
          // TODO: consider to alter this so that it will work with or without that.
          // TODO: perhaps it should be a hard requirement to use the iframe method.
          saveToStorage(defaultState);
          location.reload();
        }}
      >
        Reset all mocks
      </Button>
    </Stack>
  );
};

export default Dashboard;
