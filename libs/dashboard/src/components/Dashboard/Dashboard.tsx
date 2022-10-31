import type { State, MocksState, ScenariosState } from '@dynamic-msw/core';
import { saveToStorage, loadFromStorage } from '@dynamic-msw/core';
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
          {fuse ? (
            <TextInput
              type="search"
              placeholder="Filter"
              name="search"
              onChange={(value) => {
                setSearchValue(value.toString());
              }}
            />
          ) : null}
          <Spacing mt={2} />
          <Table
            columns={4}
            css={{ gridTemplateColumns: '2fr auto 1fr 1fr' }}
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
                                const updatedState = updateMockOptions(
                                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                  mockState!,
                                  index,
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
                    index={index + convertedMockConfig.length + 1}
                    hasMockOptions={Boolean(mocks.length >= 0)}
                    openPageURL={openPageURL}
                    isActive={convertedScenarios[index].isActive}
                    bootstrapScenario={(e) => {
                      e.preventDefault();
                      const clonedState: State = JSON.parse(
                        JSON.stringify(mockState)
                      );
                      clonedState.scenarios[index].isActive =
                        !clonedState.scenarios[index].isActive;
                      saveToStorage(clonedState);
                      setMockState(clonedState);
                      if (
                        openPageURL &&
                        clonedState.scenarios[index].isActive
                      ) {
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
                        '> div': { display: 'contents' },
                      }}
                    >
                      {mocks.map(({ mockTitle, mockOptions }, mocksIndex) => {
                        return (
                          <React.Fragment key={`${scenarioTitle}-${mockTitle}`}>
                            <h4
                              css={{
                                margin: 0,
                                gridColumnStart: 1,
                                gridColumnEnd: 3,
                                paddingLeft: '5px',
                                marginTop: '10px',
                              }}
                            >
                              {mockTitle}
                            </h4>
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
                                    selectedValue={selectedValue}
                                    options={options}
                                    onChange={(value) => {
                                      const updatedState =
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
                                      setMockState(updatedState);
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
                // ? altering default values after the reset works.
                setTimeout(() => {
                  setMockState(resetAll(mockConfig));
                }, 10);
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
