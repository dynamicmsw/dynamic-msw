import { type Store } from '../state/store';
import { type MockConfig } from './types/MockConfig';
import { type MockData } from './types/MockData';
import {
  type MockParamaterObject,
  type NormalizedMockParameters,
} from './types/MockParamater';
import normalizeParameters from './normalizeParameters';
import { type EntityId } from '@reduxjs/toolkit';
import { type DashboardConfig } from '../types/DashboardConfig';
import {
  type MaybeSetMockDataFn,
  type MaybeUpdateMockParametersFn,
  type SetMockDataFn,
  type UpdateMockParametersFn,
} from './types/CreateMockUpdateFunctions';
import {
  type UnknownDynamicHandlerFn,
  type DynamicHandlerFn,
} from './types/DynamicHandlerFn';
import { mockDashboardActions } from '../state/mock/mockDashboard.slice';
import {
  mockDataActions,
  selectMockDataById,
} from '../state/mock/mockData.slice';
import {
  mockParametersActions,
  selectMockParametersById,
} from '../state/mock/mockParameters.slice';
import { getMockEntityId } from '../state/mock/mockEntityId';
import { type CreateMockOverrides } from './types/CreateMockOverrides';
import overrideParamaters from './overrideParameters';
import { type WebSocketHandler } from 'msw/lib/core/handlers/WebSocketHandler';
import { type RequestHandler } from 'msw';
import { getParameterValues } from './getParameterValues';

export default class CreateMockApi<
  TMockKey extends string,
  TMockParameterObject,
  TMockData,
> implements CreateMockPublicApi<TMockKey, TMockParameterObject, TMockData>
{
  public readonly mockKey: TMockKey;
  private readonly initializer: UnknownDynamicHandlerFn;
  private dashboardConfig?: DashboardConfig;
  private parameters?: NormalizedMockParameters;
  private data?: TMockData & MockData;
  private isInitialized = false;
  public entityId!: EntityId;
  private store!: Store;

  constructor(
    config: MockConfig<TMockKey, TMockParameterObject, TMockData>,
    initializer: DynamicHandlerFn<TMockParameterObject, TMockData>,
    overrides: CreateMockOverrides<TMockParameterObject, TMockData> | undefined,
  ) {
    this.mockKey = config.key;
    this.initializer = initializer as UnknownDynamicHandlerFn;
    this.dashboardConfig = {
      ...config.dashboardConfig,
      ...overrides?.dashboardConfig,
    };
    this.data = overrides?.data ?? config.data;
    this.parameters = overrideParamaters(
      normalizeParameters(config.parameters),
      overrides?.parameters,
    );
  }

  public updateParameters = ((updates) => {
    this.throwOnInvalidUpdate('parameters');
    this.store.dispatch(
      mockParametersActions.updateOne({
        id: this.entityId,
        changes: updates,
      }),
    );
  }) satisfies UpdateMockParametersFn<MockParamaterObject> as MaybeUpdateMockParametersFn<TMockParameterObject>;

  public setData = ((newData) => {
    this.throwOnInvalidUpdate('data');
    this.store.dispatch(
      mockDataActions.updateOne({
        id: this.entityId,
        changes: { data: newData },
      }),
    );
  }) satisfies SetMockDataFn<MockData> as MaybeSetMockDataFn<TMockData>;

  public reset = () => {
    this.throwOnUninitialized();
    if (this.parameters) {
      this.store.dispatch(mockParametersActions.resetOne(this.entityId));
    }
    if (this.data) {
      this.store.dispatch(mockDataActions.resetOne(this.entityId));
    }
  };

  public get handlers() {
    const handlers = this.initializer({
      getParams: () =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        getParameterValues(
          selectMockParametersById(this.entityId)(this.store.getState()),
        )!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      getData: () => selectMockDataById(this.entityId)(this.store.getState())!,
      setData: this.setData as SetMockDataFn<MockData>,
    });
    return Array.isArray(handlers) ? handlers : [handlers];
  }

  public initialize = (store: Store, scenarioKey: string | undefined) => {
    const id = getMockEntityId(this.mockKey, scenarioKey);
    this.entityId = id;
    this.isInitialized = true;
    this.store = store;

    store.dispatch(
      mockDashboardActions.initializeOne({
        id,
        ...this.dashboardConfig,
      }),
    );
    store.dispatch(
      mockDataActions.initializeOne({
        id,
        data: this.data,
        initialData: this.data,
      }),
    );
    store.dispatch(
      mockParametersActions.initializeOne({
        id,
        parameters: this.parameters,
      }),
    );
  };

  private throwOnUninitialized = () => {
    if (!this.isInitialized) {
      throw new Error(
        'An mock method has been called while not being instantiated in the server/worker/dashboard.',
      );
    }
  };
  private throwOnInvalidUpdate = (updateType: 'data' | 'parameters') => {
    this.throwOnUninitialized();
    if (!this[updateType]) {
      throw new Error(
        `You tried to update ${updateType} on a mock that has no ${updateType} configuration.`,
      );
    }
    return true;
  };
}

export interface CreateMockPublicApi<
  TMockKey extends string,
  TMockParameterObject,
  TMockData,
> {
  updateParameters: MaybeUpdateMockParametersFn<TMockParameterObject>;
  setData: MaybeSetMockDataFn<TMockData>;
  handlers: Array<RequestHandler | WebSocketHandler>;
  reset: () => void;
  mockKey: TMockKey;
}
