import {
  EntityId,
  EntityState,
  PayloadAction,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import merge from "lodash/merge";
import {
  MockParameterValueType,
  NormalizedMockParameters,
} from "../types/MockParamater";
import { DashboardConfig } from "../types/DashboardConfig";
import {
  StateWithCreateScenarioSlice,
  selectIsScenarioActive,
} from "./createScenario.slice";

export type CreateMockEntity = {
  mockKey: string;
  scenarioKey: string | undefined;
  parameters: NormalizedMockParameters | undefined;
  dashboardConfig?: DashboardConfig;
  isActive?: boolean;
};

const createMockAdapater = createEntityAdapter<CreateMockEntity, EntityId>({
  selectId: (mockEntry) =>
    createMockId(mockEntry.mockKey, mockEntry.scenarioKey),
});

export const slice = createSlice({
  name: "createMock",
  initialState: () => createMockAdapater.getInitialState(),
  reducers: {
    upsertOne: (
      state,
      {
        payload: { mockKey, scenarioKey, parameters, dashboardConfig },
      }: PayloadAction<CreateMockEntity>
    ) => {
      const id = createMockId(mockKey, scenarioKey);
      const prevState = state.entities[id];
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!prevState) {
        return createMockAdapater.setOne(state, {
          mockKey,
          scenarioKey,
          parameters,
          dashboardConfig,
          isActive: true,
        });
      }
      return createMockAdapater.upsertOne(state, {
        mockKey,
        scenarioKey,
        parameters: merge(prevState.parameters, parameters),
        dashboardConfig,
      });
    },
    updateOne: (
      state,
      {
        payload: { mockKey, scenarioKey, changes },
      }: PayloadAction<{
        mockKey: string;
        scenarioKey: string | undefined;
        changes: {
          parameters?: Record<
            string,
            MockParameterValueType | undefined | null
          >;
          isActive?: boolean;
        };
      }>
    ) => {
      const entitiy = state.entities[createMockId(mockKey, scenarioKey)];
      Object.entries(changes.parameters || {}).forEach(([key, value]) => {
        const currentParameter = entitiy.parameters?.[key];
        if (!currentParameter) {
          throw new Error(
            `You are trying to update a parameter that does not exists; mockKey: ${mockKey}, scenarioKey: ${scenarioKey}`
          );
        }
        if (value === null && !currentParameter.nullable) {
          return currentParameter;
        }
        currentParameter.currentValue = value!;
      });
      entitiy.isActive = changes.isActive ?? entitiy.isActive;
    },
    resetAll: (state) => {
      state.ids.forEach((id) => {
        const parameters = state.entities[id].parameters;
        if (parameters) {
          Object.keys(parameters).forEach((key) => {
            parameters[key].currentValue = undefined;
          });
        }
      });
    },
    resetOne: (state, { payload }: PayloadAction<EntityId>) => {
      const parameters = state.entities[payload].parameters;
      if (parameters) {
        Object.keys(parameters).forEach((key) => {
          parameters[key].currentValue = undefined;
        });
      }
    },
  },
});

export interface StateWithCreateMockSlice {
  [slice.name]: EntityState<CreateMockEntity, EntityId>;
}

export const createMockActions = slice.actions;

export default slice.reducer;

const selectors = createMockAdapater.getSelectors();

export const selectAllCreateMocks = (state: StateWithCreateMockSlice) =>
  selectors.selectAll(state.createMock);
export const selectCreateMockById =
  (id: EntityId) => (state: StateWithCreateMockSlice) =>
    selectors.selectById(state.createMock, id);

export const selectScenarioMocksById =
  (id: EntityId) =>
  (state: { createMock: EntityState<CreateMockEntity, EntityId> }) =>
    selectAllCreateMocks(state).filter((mock) => mock.scenarioKey === id);

export const selectAllNonScenarioMocks = (state: StateWithCreateMockSlice) =>
  selectAllCreateMocks(state).filter((mock) => !mock.scenarioKey);

export const selectAllNonScenarioMocksIds = (state: StateWithCreateMockSlice) =>
  selectAllNonScenarioMocks(state).map((mock) => mock.mockKey);

export const selectIsMockActive =
  (id: EntityId) =>
  (state: StateWithCreateMockSlice & StateWithCreateScenarioSlice) => {
    const mock = selectCreateMockById(id)(state);
    if (mock.scenarioKey) {
      return selectIsScenarioActive(mock.scenarioKey)(state);
    }
    return mock.isActive;
  };

export function createMockId(
  mockKey: string,
  scenarioKey: string | undefined
): EntityId {
  return `${
    scenarioKey ? `__scenarioKey__:${scenarioKey}` : ""
  }__mockKey__:${mockKey}`;
}
