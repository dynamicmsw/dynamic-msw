import { type ConvertMockParameters } from "../types/ConvertMockParameters";
import {
  MockParameterValueType,
  type MockParamaterObject,
} from "../types/MockParamater";
import { Store } from "../state/store";
import { createMockActions, createMockId } from "../state/createMock.slice";
import normalizeParameters from "./normalizeParameters";
import { DynamicMockHandlerFn } from "../types/DynamicMockHandlerFn";
import { EntityId } from "@reduxjs/toolkit";
import { DashboardConfig } from "../types/DashboardConfig";

export default function createMock<
  TMockKey extends string,
  TMockParameterObject extends MockParamaterObject = MockParamaterObject
>(
  {
    key,
    parameters,
    dashboardConfig,
  }: {
    key: TMockKey;
    parameters?: TMockParameterObject;
    dashboardConfig?: DashboardConfig;
  },
  handlers: DynamicMockHandlerFn<TMockParameterObject>
): CreateMockReturnType<TMockKey, TMockParameterObject> {
  let isInitialized = false;
  let scenarioKey: string | undefined;
  let store: Store;
  let overrides: Record<string, MockParameterValueType> | undefined;
  const getEntityId = () => {
    if (!isInitialized) {
      throw new Error(
        "Tried updating a dynamic mock/scenario that is not being used by the server/worker. Please ensure you pass it to the setupServer/setupWorker/setupDashboard function."
      );
    }
    return createMockId(key, scenarioKey);
  };

  return {
    // TODO: add override functionality for createScenario
    overrideParameterDefaults: (
      parameters: Partial<ConvertMockParameters<TMockParameterObject>>
    ) => {
      if (isInitialized) {
        throw new Error(
          "Can not override parameter defaults after the setupWorker/setupDashboard/setupDashboard has been initialized. Use updateParameters instead."
        );
      }
      overrides = parameters as Record<string, MockParameterValueType>;
    },
    updateParameters: (
      parameters: Partial<ConvertMockParameters<TMockParameterObject>>
    ) => {
      store.dispatch(
        createMockActions.updateOne({
          mockKey: key,
          scenarioKey,
          changes: { parameters },
        })
      );
    },
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
            parameters: normalizeParameters(parameters, overrides),
            mockKey: key,
            scenarioKey,
            dashboardConfig,
          })
        );
      },
      getHandlers: () => handlers,
      getEntityId,
      key,
      isCreateMock: true,
    },
  };
}

export type CreateMockReturnType<
  TKey extends string = string,
  TMockParameterObject extends MockParamaterObject = MockParamaterObject
> = {
  overrideParameterDefaults: (
    parameters: Partial<ConvertMockParameters<TMockParameterObject>>
  ) => void;
  updateParameters: (
    parameters: Partial<ConvertMockParameters<TMockParameterObject>>
  ) => void;
  reset: () => void;
  internals: {
    initialize: (store: Store, scenarioKey: string | undefined) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getHandlers: () => DynamicMockHandlerFn<any>;
    getEntityId: () => EntityId;
    key: TKey;
    isCreateMock: true;
  };
};
