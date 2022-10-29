import type { State } from '@dynamic-msw/core';
import { saveToStorage, loadFromStorage } from '@dynamic-msw/core';
import {
  Table,
  Button,
  ExpansionPanelContextProvider,
  Flex,
  Container,
} from '@stela-ui/react';
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (!mockState && !isLoading && mockConfig) {
      setMockState(mockConfig);
    }
  }, [mockConfig, isLoading, mockState]);

  const convertedMockConfig = mockState
    ? convertMockConfig(mockState.mocks)
    : [];
  const convertedScenarios = mockState
    ? convertScenarios(mockState?.scenarios)
    : [];
  return (
    <form>
      <Flex gap={4}>
        <Container>
          <h1>Dynamic MSW Dashboard</h1>
        </Container>
        {isLoading && (
          <Container>
            <h4 data-testid="dashboard-state">Loading mock config...</h4>
          </Container>
        )}
        {iFrameError && <h4 data-testid="dashboard-state">{iFrameError}</h4>}
        <Container>
          <Table
            columns={3}
            backgroundColorEven="magnolia"
            backgroundColorOdd="alabaster"
          >
            <ExpansionPanelContextProvider>
              {convertedMockConfig.map(
                ({ mockTitle, mockOptions, openPageURL }, index) => (
                  <OptionsTableRow
                    key={mockTitle}
                    rowTitle={mockTitle}
                    index={index}
                    hasMockOptions={mockOptions.length >= 0}
                    openPageURL={openPageURL}
                  >
                    <Flex
                      rowGap={3}
                      flow="row"
                      alignY="center"
                      css={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        '> div': { display: 'contents' },
                      }}
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
                    </Flex>
                  </OptionsTableRow>
                )
              )}
              {convertedScenarios.map(
                ({ scenarioTitle, mocks, openPageURL }, index) => (
                  <OptionsTableRow
                    key={`${scenarioTitle}`}
                    rowTitle={scenarioTitle}
                    index={index + convertedMockConfig.length}
                    hasMockOptions={Boolean(mocks.length >= 0)}
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
                    <Flex
                      rowGap={3}
                      flow="row"
                      alignY="center"
                      css={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        '> span > div': { display: 'contents' },
                      }}
                    >
                      {mocks.map(({ mockTitle, mockOptions }, mocksIndex) => {
                        const rowBaseIndex =
                          mocksIndex +
                          1 +
                          (mocks[mocksIndex - 1]?.mockOptions.length || 0);

                        return (
                          <React.Fragment key={`${scenarioTitle}-${mockTitle}`}>
                            <h4
                              css={{
                                margin: 0,
                                gridRow: rowBaseIndex,
                                gridColumnStart: 1,
                                gridColumnEnd: 3,
                              }}
                            >
                              {mockTitle}
                            </h4>
                            {mockOptions.map(
                              (
                                { selectedValue, options, type, title },
                                optionsIndex
                              ) => {
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
                                    gridRow={rowBaseIndex + 1 + optionsIndex}
                                    selectedValue={selectedValue}
                                    options={options}
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
                          </React.Fragment>
                        );
                      })}
                    </Flex>
                  </OptionsTableRow>
                )
              )}
            </ExpansionPanelContextProvider>
          </Table>
        </Container>
        {mockConfig && (
          <Container>
            <Button
              data-testid="reset-all-mocks-button"
              type="reset"
              onClick={() => {
                setMockState(resetAll(mockConfig));
              }}
            >
              Reset all mocks
            </Button>
          </Container>
        )}
      </Flex>
    </form>
  );
};

export default Dashboard;
