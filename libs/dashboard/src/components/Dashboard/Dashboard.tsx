import type { State } from '@dynamic-msw/core';
import { saveToStorage, loadFromStorage } from '@dynamic-msw/core';
import {
  Table,
  Button,
  ExpansionPanelContextProvider,
  Stack,
} from '@stela-ui/react';
import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';

import {
  convertMockConfig,
  convertScenarios,
  updateMockOptions,
  updateScenarioOptions,
  resetAll,
  getInputType,
} from './Dashboard.helpers';
import { MockOptionsInput } from './MockOptionsInput';
import { OptionsTableRow } from './OptionsTableRow';
import { useGetMockConfig } from './useGetMockConfig';

/* eslint-disable-next-line */
export interface DashboardProps {}

export const Dashboard: FC<DashboardProps> = () => {
  const { mockConfig, isLoading, iFrameError } = useGetMockConfig();
  const [mockState, setMockState] = useState<State>();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!mockState && !isLoading && mockConfig) {
      setMockState(mockConfig);
    }
  }, [mockConfig, isLoading, mockState]);

  const convertedMockConfig = mockState
    ? convertMockConfig(mockState.mocks)
    : [];
  const convertedScenarios = mockState
    ? convertScenarios(mockState.scenarios)
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
          <form
            ref={formRef}
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
                              mockState!,
                              index,
                              title,
                              inputType === 'number' ? Number(value) : value
                            );
                            setMockState(loadFromStorage());
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
                    bootstrapScenario={(e) => {
                      e.preventDefault();
                      const clonedState: State = JSON.parse(
                        JSON.stringify(mockState)
                      );
                      clonedState.scenarios.map((data) => ({
                        ...data,
                        isActive: false,
                      }));
                      clonedState.scenarios[index].isActive = true;
                      saveToStorage(clonedState);
                      setMockState(clonedState);

                      if (openPageURL) {
                        window.open(openPageURL, '_blank')?.focus();
                      }
                    }}
                  >
                    {mocks.map(({ mockTitle, mockOptions }, mocksIndex) => (
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
                                  updateScenarioOptions(
                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                    mockState!,
                                    index,
                                    mocksIndex,
                                    title,
                                    inputType === 'number'
                                      ? Number(value)
                                      : value
                                  );
                                  setMockState(loadFromStorage());
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
          </form>
        </ExpansionPanelContextProvider>
      </Table>
      {mockConfig && (
        <Button
          data-testid="reset-all-mocks-button"
          type="reset"
          onClick={(e) => {
            e.preventDefault();
            setMockState(resetAll(mockConfig));
            formRef.current?.reset();
          }}
        >
          Reset all mocks
        </Button>
      )}
    </Stack>
  );
};

export default Dashboard;
