import {
  configureMockActions,
  configureMockId,
} from '../state/createMock.slice';
import { Store } from '../state/store';
import { CreateMockOverrides } from '../types/CreateMockOverrides';
import { PrimitiveMockParameters } from '../types/PrimitiveMockParameters';
import { MockConfig } from '../types/MockConfig';
import {
  AnyDynamicMockHandlerFn,
  DynamicMockHandlerFn,
} from '../types/DynamicMockHandlerFn';
import { MockData } from '../types/MockData';
import {
  MockParamaterObject,
  NormalizedMockParameters,
} from '../types/MockParamater';
import normalizeParameters from './normalizeParameters';
import { EntityId } from '@reduxjs/toolkit';
import { DashboardConfig } from '../types/DashboardConfig';
import {
  MaybeUpdateMockDataFn,
  MaybeUpdateMockParametersFn,
  UpdateMockDataFn,
  UpdateMockParametersFn,
} from '../types/CreateMockUpdateFunctions';

export default class CreateMockApi<
  TMockKey extends string,
  TMockParameterObject,
  TMockData
> implements CreateMockPublicApi<TMockKey, TMockParameterObject, TMockData>
{
  public readonly mockKey: TMockKey;
  private dashboardConfig: DashboardConfig;
  private parameters?: NormalizedMockParameters;
  private data?: TMockData & MockData;
  private handlers: DynamicMockHandlerFn<TMockParameterObject, TMockData>;
  private scenarioKey?: string;
  private isInitialized = false;
  private _store?: Store;
  constructor(
    config: MockConfig<TMockKey, TMockParameterObject, TMockData>,
    handlers: DynamicMockHandlerFn<TMockParameterObject, TMockData>,
    overrides: CreateMockOverrides<TMockParameterObject, TMockData> | undefined
  ) {
    this.mockKey = config.key;
    this.dashboardConfig = {
      ...config.dashboardConfig,
      ...overrides?.dashboardConfig,
    };
    this.handlers = handlers;
    this.data = overrides?.data ?? config.data;
    this.parameters =
      config.parameters &&
      normalizeParameters(config.parameters, overrides?.parameters);
  }

  public updateParameters = ((updates) => {
    this.throwOnInvalidUpdate('parameters');
    this.store.dispatch(
      configureMockActions.updateOne({
        mockKey: this.mockKey,
        scenarioKey: this.scenarioKey,
        changes: { parameters: updates },
      })
    );
  }) satisfies UpdateMockParametersFn<MockParamaterObject> as MaybeUpdateMockParametersFn<TMockParameterObject>;

  public updateData = ((newData) => {
    this.throwOnInvalidUpdate('data');
    this.store.dispatch(
      configureMockActions.updateOne({
        mockKey: this.mockKey,
        scenarioKey: this.scenarioKey,
        changes: { data: newData },
      })
    );
  }) satisfies UpdateMockDataFn<MockData> as MaybeUpdateMockDataFn<TMockData>;

  public reset = () => {
    this.throwOnUninitialized();
    this.store.dispatch(
      configureMockActions.resetOne(this.internals.getEntityId())
    );
    if (this.data) {
      this.store.dispatch(
        configureMockActions.updateOne({
          mockKey: this.mockKey,
          scenarioKey: this.scenarioKey,
          changes: { data: this.data },
        })
      );
    }
  };

  public get internals(): CreateMockInternals {
    return {
      getEntityId: () => {
        this.throwOnUninitialized();
        return configureMockId(this.mockKey, this.scenarioKey);
      },
      initialize: (store, scenarioKey, scenarioDashboardConfig) => {
        this.isInitialized = true;
        this._store = store;
        this.scenarioKey = scenarioKey;
        this.dashboardConfig = {
          ...this.dashboardConfig,
          ...scenarioDashboardConfig,
        };
        store.dispatch(
          configureMockActions.upsertOne({
            parameters: this.parameters,
            data: this.data,
            mockKey: this.mockKey,
            scenarioKey,
            dashboardConfig: this.dashboardConfig,
          })
        );
      },
      getHandlers: () => this.handlers as AnyDynamicMockHandlerFn,
      overrideParameters: (dataOverrides: PrimitiveMockParameters<any>) => {
        this.data = dataOverrides;
      },
      overrideData: (dataOverrides: MockData) => {
        this.data = dataOverrides as TMockData & MockData;
      },
    };
  }
  private get store(): Store {
    if (!this._store) {
      throw new Error('No-op: Tried getting store before initialization.');
    }
    return this._store;
  }
  private throwOnUninitialized = () => {
    if (!this.isInitialized) {
      throw new Error(
        'An mock or scenario method has been called while not being instantiated in the server/worker/dashboard.'
      );
    }
  };
  private throwOnInvalidUpdate = (updateType: 'data' | 'parameters') => {
    this.throwOnUninitialized();
    if (!this[updateType]) {
      throw new Error(
        `You tried to update ${updateType} on a mock that has no ${updateType} configuration.`
      );
    }
    return true;
  };
}

export interface CreateMockPublicApi<
  TMockKey extends string,
  TMockParameterObject,
  TMockData
> {
  updateParameters: MaybeUpdateMockParametersFn<TMockParameterObject>;
  updateData: MaybeUpdateMockDataFn<TMockData>;
  reset: () => void;
  mockKey: TMockKey;
}

export type CreateMockInternals = {
  initialize: (
    store: Store,
    scenarioKey: string | undefined,
    scenarioDashboardConfig: DashboardConfig | undefined
  ) => void;
  getHandlers: () => AnyDynamicMockHandlerFn;
  getEntityId: () => EntityId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overrideParameters: (parameters: PrimitiveMockParameters<any>) => void;
  overrideData: (data: MockData) => void;
};
