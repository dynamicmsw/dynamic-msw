import { type Store } from '../state/store';
import { type AnyCreateMockPublicApi } from '../configureMock/types/AnyCreateMockApi';
import { type AnyCreateMockApi } from '../configureMock/types/AnyCreateMockApi';
import { type CreateScenarioOverrides } from './types/CreateScenarioOverrides';
import {
  type UpdateScenarioDataFn,
  type UpdateScenarioParametersFn,
} from './types/CreateScenarioUpdateFunctions';
import { type DashboardConfig } from '../types/DashboardConfig';

import { getMockEntityId } from '../state/mock/mockEntityId';
import { mockParametersActions } from '../state/mock/mockParameters.slice';
import { mockDataActions } from '../state/mock/mockData.slice';
import { mockDashboardActions } from '../state/mock/mockDashboard.slice';
import { scenarioActions } from '../state/scenario.slice';
import { type RequestHandler } from 'msw';
import { type WebSocketHandler } from 'msw/lib/core/handlers/WebSocketHandler';

export default class CreateScenarioApi<
  TCreateMocks extends AnyCreateMockPublicApi[],
> implements CreateScenarioPublicApi<TCreateMocks>
{
  public scenarioKey: string;
  public mocks: AnyCreateMockApi[];
  private store!: Store;
  private dashboardConfig: DashboardConfig;
  private overrides: CreateScenarioOverrides<TCreateMocks> | undefined;
  private isInitialized = false;

  constructor(
    key: string,
    mocks: [...TCreateMocks],
    dashboardConfig?: DashboardConfig,
    overrides?: CreateScenarioOverrides<TCreateMocks>,
  ) {
    this.scenarioKey = key;
    this.mocks = mocks as unknown as AnyCreateMockApi[];
    this.dashboardConfig = {
      ...dashboardConfig,
      ...overrides?.dashboardConfig,
    };
    this.overrides = overrides;
  }

  public updateParameters: UpdateScenarioParametersFn<TCreateMocks> = (
    parameters,
  ) => {
    this.throwOnUninitialized();
    Object.entries(parameters).forEach(([mockKey, mockParameters]) => {
      this.store.dispatch(
        mockParametersActions.updateOne({
          id: getMockEntityId(mockKey, this.scenarioKey),
          changes: mockParameters,
        }),
      );
    });
  };

  public setData: UpdateScenarioDataFn<TCreateMocks> = (data) => {
    this.throwOnUninitialized();
    Object.entries(data).forEach(([mockKey, mockData]) => {
      this.store.dispatch(
        mockDataActions.updateOne({
          id: getMockEntityId(mockKey, this.scenarioKey),
          changes: { data: mockData },
        }),
      );
    });
  };

  public reset = () => {
    this.throwOnUninitialized();
    this.mocks.forEach((mock) => {
      mock.reset();
    });
  };

  public get handlers() {
    return this.mocks.flatMap((mock) => mock.handlers);
  }

  public initialize = (store: Store) => {
    this.isInitialized = true;
    this.store = store;

    store.dispatch(
      scenarioActions.initializeOne({
        id: this.scenarioKey,
        mockKeys: this.mocks.map((mock) => mock.mockKey),
        ...this.dashboardConfig,
      }),
    );

    this.mocks.forEach((mock) => {
      mock.initialize(store, this.scenarioKey);

      const mockEntityId = getMockEntityId(mock.mockKey, this.scenarioKey);

      const parameterOverrides = this.overrides?.parameters?.[mock.mockKey];

      if (parameterOverrides) {
        store.dispatch(
          mockParametersActions.overrideOne({
            id: mockEntityId,
            changes: parameterOverrides,
          }),
        );
      }

      const dataOverrides = this.overrides?.data?.[mock.mockKey];

      if (dataOverrides) {
        store.dispatch(
          mockDataActions.setOne({
            id: mockEntityId,
            data: dataOverrides,
            initialData: dataOverrides,
          }),
        );
      }

      store.dispatch(
        mockDashboardActions.updateOne({
          id: mockEntityId,
          changes: {
            isActiveByDefault: this.dashboardConfig.isActiveByDefault ?? true,
          },
        }),
      );
    });
  };

  private throwOnUninitialized = () => {
    if (!this.isInitialized) {
      throw new Error(
        'An scenario method has been called while not being instantiated in the server/worker/dashboard.',
      );
    }
  };
}

export interface CreateScenarioPublicApi<
  TCreateMocks extends AnyCreateMockPublicApi[],
> {
  updateParameters: UpdateScenarioParametersFn<TCreateMocks>;
  setData: UpdateScenarioDataFn<TCreateMocks>;
  handlers: Array<RequestHandler | WebSocketHandler>;
  reset: () => void;
  scenarioKey: string;
}
