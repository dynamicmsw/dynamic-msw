import type { State, MocksState, ScenariosState } from '@dynamic-msw/core';
import { saveToStorage } from '@dynamic-msw/core';
import {
  Table,
  Button,
  ExpansionPanelContextProvider,
  Flex,
  Container,
  TextInput,
  Spacing,
} from '@stela-ui/react';
import Fuse from 'fuse.js';
import React, { useState, useEffect, useMemo } from 'react';
import type { FC } from 'react';

import {
  convertMockConfig,
  convertScenarios,
  updateMockOptions,
  updateScenarioOptions,
  resetAll,
  getInputType,
  isMockActive,
} from './Dashboard.helpers';
import { MockOptionsInput } from './MockOptionsInput';
import { OptionsTableRow } from './OptionsTableRow';
import { useGetMockConfig } from './useGetMockConfig';

/* eslint-disable-next-line */
export interface DashboardProps {}

export const Dashboard: FC<DashboardProps> = () => {
  const { mockConfig, isLoading, iFrameError } = useGetMockConfig();
  const [mockState, setMockState] = useState<State>();
  const [searchValue, setSearchValue] = useState<string>();
  const [filteredMockState, setFilteredMockState] = useState<State | null>();
  const fuse = useMemo(
    () =>
      mockState
        ? new Fuse([...mockState.mocks, ...mockState.scenarios], {
            keys: ['mockTitle', 'scenarioTitle'],
            threshold: 0.2,
          })
        : null,
    [Boolean(mockState)]
  );

  // Update filtered collection when mockState or searchValue updates
  useEffect(() => {
    if (mockState && searchValue && fuse) {
      fuse.setCollection([...mockState.mocks, ...mockState.scenarios]);

      const foundItems = fuse.search(searchValue).map(({ item }) => item);

      setFilteredMockState({
        mocks: foundItems.filter(
          (data) => (data as MocksState).mockTitle
        ) as MocksState[],
        scenarios: foundItems.filter(
          (data) => (data as ScenariosState).scenarioTitle
        ) as ScenariosState[],
      });
    } else if (!searchValue) {
      setFilteredMockState(null);
    }
  }, [mockState, searchValue]);

  // Set initial mockState
  useEffect(() => {
    if (!mockState && !isLoading && mockConfig) {
      setMockState(mockConfig);
    }
  }, [mockConfig, isLoading, mockState]);

  const convertedMockConfig = mockState
    ? convertMockConfig(
        filteredMockState ? filteredMockState.mocks : mockState.mocks
      )
    : [];
  const convertedScenarios = mockState
    ? convertScenarios(
        filteredMockState ? filteredMockState.scenarios : mockState?.scenarios
      )
    : [];
  return (
    <form
      css={{ padding: '10px' }}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <Flex gap={4}>
        <Container>
          <h1 css={{ margin: 0 }}>Dynamic MSW Dashboard</h1>
        </Container>
        {isLoading && (
          <Container>
            <h4 data-testid="dashboard-state">Loading mock config...</h4>
          </Container>
        )}
        {iFrameError && <h4 data-testid="dashboard-state">{iFrameError}</h4>}
        <Container
          css={
            mockState
              ? {
                  background: '#ebebeb',
                  padding: '4px',
                  borderRadius: '4px',
                }
              : {}
          }
        >
          {/* TODO: add all flex types to align props */}
          <Flex
            gap={2}
            flow="row"
            alignY="center"
            css={{ justifyContent: 'space-between' }}
          >
            {fuse ? (
              <TextInput
                data-testid="search-input"
                type="search"
                placeholder="Filter"
                name="search"
                defaultValue={searchValue}
                onChange={(value) => {
                  setSearchValue(value.toString());
                }}
              />
            ) : null}
            {mockConfig && (
              <Button
                size="s"
                data-testid="reset-all-mocks-button"
                onClick={() => {
                  setMockState(resetAll(mockConfig));
                }}
              >
                Reset all mocks
              </Button>
            )}
          </Flex>
          <Spacing mt={2} />
          <Table
            columns={4}
            css={{
              gridTemplateColumns: `auto minmax(200px, 1fr) auto minmax(auto, 300px)`,
              overflowX: 'auto',
            }}
            backgroundColorEven="white"
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
                    isActive={isMockActive(mockState!, mockTitle)}
                  >
                    <Flex
                      rowGap={3}
                      flow="row"
                      alignY="center"
                      css={{
                        paddingLeft: '10px',
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        '> div': { display: 'contents' },
                      }}
                    >
                      {mockOptions.map(
                        ({
                          selectedValue,
                          defaultValue,
                          options,
                          type,
                          title,
                        }) => {
                          const inputType = getInputType(
                            defaultValue,
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
                                const updatedState = updateMockOptions(
                                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                  mockState!,
                                  mockTitle,
                                  title,
                                  inputType === 'number' ? Number(value) : value
                                );
                                setMockState(updatedState);
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
                    isActive={convertedScenarios[index].isActive}
                    bootstrapScenario={(e) => {
                      e.preventDefault();
                      const clonedState: State = JSON.parse(
                        JSON.stringify(mockState)
                      );
                      clonedState.scenarios = clonedState.scenarios.map(
                        (data, i) => ({
                          ...data,
                          isActive: i === index ? !data.isActive : false,
                        })
                      );
                      saveToStorage(clonedState);
                      setMockState(clonedState);
                    }}
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
                      {mocks.map(
                        (
                          { mockTitle, originalMockTitle, mockOptions },
                          mocksIndex
                        ) => {
                          return (
                            <React.Fragment
                              key={`${scenarioTitle}-${mockTitle}`}
                            >
                              <h4
                                css={{
                                  margin: 0,
                                  gridColumnStart: 1,
                                  gridColumnEnd: 3,
                                  paddingLeft: '5px',
                                  marginTop: '10px',
                                }}
                              >
                                {originalMockTitle}
                              </h4>
                              {mockOptions.map(
                                ({
                                  selectedValue,
                                  defaultValue,
                                  options,
                                  type,
                                  title,
                                }) => {
                                  const inputType = getInputType(
                                    defaultValue,
                                    selectedValue,
                                    options,
                                    type
                                  );
                                  return (
                                    <MockOptionsInput
                                      key={`${scenarioTitle}-${mockTitle}-${title}`}
                                      id={`${scenarioTitle}-${mockTitle}-${title}`}
                                      title={title}
                                      selectedValue={selectedValue}
                                      options={options}
                                      onChange={(value) => {
                                        const updatedState =
                                          updateScenarioOptions(
                                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                            mockState!,
                                            scenarioTitle,
                                            mocksIndex,
                                            title,
                                            inputType === 'number'
                                              ? Number(value)
                                              : value
                                          );
                                        setMockState(updatedState);
                                      }}
                                      inputType={inputType}
                                    />
                                  );
                                }
                              )}
                            </React.Fragment>
                          );
                        }
                      )}
                    </Flex>
                  </OptionsTableRow>
                )
              )}
            </ExpansionPanelContextProvider>
          </Table>
        </Container>
      </Flex>
    </form>
  );
};

export default Dashboard;
