import { createMockActions, createMockId } from '../state/createMock.slice';
import { Store } from '../state/store';
import { ConvertMockParameters } from '../types/ConvertMockParameters';
import { CreateMockConfig } from '../types/CreateMockConfig';
import {
  AnyDynamicMockHandlerFn,
  DynamicMockHandlerFn,
} from '../types/DynamicMockHandlerFn';
import { MockData } from '../types/MockData';
import {
  MockParamaterObject,
  MockParameterValueType,
} from '../types/MockParamater';
import normalizeParameters from './normalizeParameters';
import { EntityId } from '@reduxjs/toolkit';

export default function createMock<
  TMockKey extends string,
  TMockParameterObject,
  TMockData
>(
  {
    key,
    parameters,
    data,
    dashboardConfig,
  }: CreateMockConfig<TMockKey, TMockParameterObject, TMockData>,
  handlers: DynamicMockHandlerFn<TMockParameterObject, TMockData>
): CreateMockReturnType<TMockKey, TMockParameterObject, TMockData> {
  let isInitialized = false;
  let scenarioKey: string | undefined;
  let store: Store;
  let parameterOverrides: Record<string, MockParameterValueType> | undefined;
  let dataOverride: TMockData | undefined;
  const getEntityId = () => {
    if (!isInitialized) {
      throw new Error(
        'Tried updating a dynamic mock/scenario that is not being used by the server/worker. Please ensure you pass it to the setupServer/setupWorker/setupDashboard function.'
      );
    }
    return createMockId(key, scenarioKey);
  };

  return {
    overrideDefaultParameterValues: parameters
      ? (overrideParameters) => {
          if (isInitialized) {
            throw new Error(
              'Can not override parameter defaults after the setupWorker/setupDashboard/setupDashboard has been initialized. Use updateParameters instead.'
            );
          }
          parameterOverrides = overrideParameters as Record<
            string,
            MockParameterValueType
          >;
        }
      : (undefined as any),
    updateParameters: parameters
      ? (parameters) => {
          store.dispatch(
            createMockActions.updateOne({
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
            createMockActions.updateOne({
              mockKey: key,
              scenarioKey,
              changes: { data },
            })
          );
        }
      : (undefined as any),
    overrideDefaultData: data
      ? (data) => {
          dataOverride = data;
        }
      : (undefined as any),
    reset: () => {
      store.dispatch(createMockActions.resetOne(getEntityId()));
    },
    internals: {
      initialize: (
        globalStore: Store,
        passedScenarioKey: string | undefined
      ) => {
        isInitialized = true;
        store = globalStore;
        scenarioKey = passedScenarioKey;
        store.dispatch(
          createMockActions.upsertOne({
            parameters: normalizeParameters(parameters, parameterOverrides),
            data: dataOverride ?? data,
            mockKey: key,
            scenarioKey,
            dashboardConfig,
          })
        );
      },
      getHandlers: () => handlers as AnyDynamicMockHandlerFn,
      getEntityId,
      key,
      isCreateMock: true,
    },
  };
}

export type CreateMockReturnType<
  TKey extends string,
  TMockParameterObject,
  TMockData
> = {
  overrideDefaultParameterValues: TMockParameterObject extends MockParamaterObject
    ? OverrideParameterDefaultsFn<TMockParameterObject>
    : undefined;
  updateParameters: TMockParameterObject extends MockParamaterObject
    ? UpdateParametersFn<TMockParameterObject>
    : undefined;
  updateData: TMockData extends MockData
    ? (data: TMockData) => void
    : undefined;
  overrideDefaultData: TMockData extends MockData
    ? (data: TMockData) => void
    : undefined;
  reset: () => void;
  internals: {
    initialize: (store: Store, scenarioKey: string | undefined) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getHandlers: () => AnyDynamicMockHandlerFn;
    getEntityId: () => EntityId;
    key: TKey;
    isCreateMock: true;
  };
};
type OverrideParameterDefaultsFn<
  TMockParameterObject extends MockParamaterObject
> = UpdateParametersFn<TMockParameterObject>;

type UpdateParametersFn<TMockParameterObject extends MockParamaterObject> = (
  parameters: Partial<ConvertMockParameters<TMockParameterObject>>
) => void;

export type AnyCreateMockReturnType = CreateMockReturnType<
  string,
  MockParamaterObject | undefined,
  any
>;
