import {
  configureMockActions,
  configureMockId,
} from '../state/createMock.slice';
import { Store } from '../state/store';
import { CreateMockOverrides } from '../types/CreateMockOverrides';
import { PrimitiveMockParameters } from '../types/PrimitiveMockParameters';
import { ConfigureMockConfig } from '../types/ConfigureMockConfig';
import {
  AnyDynamicMockHandlerFn,
  DynamicMockHandlerFn,
} from '../types/DynamicMockHandlerFn';
import { MockData } from '../types/MockData';
import { MockParamaterObject } from '../types/MockParamater';
import normalizeParameters from './normalizeParameters';
import { EntityId } from '@reduxjs/toolkit';
import { DashboardConfig } from '../types/DashboardConfig';

export default function configureMock<
  TMockKey extends string,
  TMockParameterObject,
  TMockData
>(
  {
    key,
    parameters,
    data,
    dashboardConfig,
  }: ConfigureMockConfig<TMockKey, TMockParameterObject, TMockData>,
  handlers: DynamicMockHandlerFn<TMockParameterObject, TMockData>
): (
  overrides?: CreateMockOverrides<TMockParameterObject, TMockData>
) => CreateMockReturnType<TMockKey, TMockParameterObject, TMockData> {
  return (passedOverrides) => {
    const overrides = { ...passedOverrides };
    let isInitialized = false;
    let scenarioKey: string | undefined;
    let store: Store;
    const getEntityId = () => {
      if (!isInitialized) {
        throw new Error(
          'Tried updating a dynamic mock/scenario that is not being used by the server/worker. Please ensure you pass it to the setupServer/setupWorker/setupDashboard function.'
        );
      }
      return configureMockId(key, scenarioKey);
    };

    return {
      updateParameters: parameters
        ? (parameters) => {
            store.dispatch(
              configureMockActions.updateOne({
                mockKey: key,
                scenarioKey,
                changes: { parameters },
              })
            );
          }
        : (undefined as any),
      updateData: data
        ? (data) => {
            store.dispatch(
              configureMockActions.updateOne({
                mockKey: key,
                scenarioKey,
                changes: { data },
              })
            );
          }
        : (undefined as any),
      reset: () => {
        store.dispatch(configureMockActions.resetOne(getEntityId()));
        if (data) {
          store.dispatch(
            configureMockActions.updateOne({
              mockKey: key,
              scenarioKey,
              changes: { data: overrides?.data ?? data },
            })
          );
        }
      },
      internals: {
        initialize: (
          globalStore,
          passedScenarioKey,
          scenarioDashboardConfig
        ) => {
          isInitialized = true;
          store = globalStore;
          scenarioKey = passedScenarioKey;
          store.dispatch(
            configureMockActions.upsertOne({
              parameters: normalizeParameters(
                parameters,
                overrides?.parameters
              ),
              data: overrides?.data ?? data,
              mockKey: key,
              scenarioKey,
              dashboardConfig: scenarioDashboardConfig ?? {
                ...dashboardConfig,
                ...overrides?.dashboardConfig,
              },
            })
          );
        },
        getHandlers: () => handlers as AnyDynamicMockHandlerFn,
        getEntityId,
        key,
        isCreateMock: true,
        overrideData: (dataOverrides) => {
          overrides.data = dataOverrides;
        },
        overrideParameters: (parameterOverrides) => {
          overrides.parameters = parameterOverrides;
        },
      },
    } satisfies AnyCreateMockReturnType;
  };
}

export type CreateMockReturnType<
  TKey extends string,
  TMockParameterObject,
  TMockData
> = {
  updateParameters: TMockParameterObject extends MockParamaterObject
    ? UpdateParametersFn<TMockParameterObject>
    : undefined;
  updateData: TMockData extends MockData
    ? (data: TMockData) => void
    : undefined;
  reset: () => void;
  internals: {
    initialize: (
      store: Store,
      scenarioKey: string | undefined,
      scenarioDashboardConfig: DashboardConfig | undefined
    ) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getHandlers: () => AnyDynamicMockHandlerFn;
    getEntityId: () => EntityId;
    key: TKey;
    isCreateMock: true;
    overrideParameters: (parameters: any) => void;
    overrideData: (data: any) => void;
  };
};

type UpdateParametersFn<TMockParameterObject extends MockParamaterObject> = (
  parameters: Partial<PrimitiveMockParameters<TMockParameterObject>>
) => void;

export type AnyCreateMockReturnType = CreateMockReturnType<
  string,
  MockParamaterObject | undefined,
  any
>;
