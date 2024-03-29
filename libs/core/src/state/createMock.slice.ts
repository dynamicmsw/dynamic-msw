/// <reference types="reselect" />
import {
  type EntityId,
  type EntityState,
  type PayloadAction,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  type MockParameterPrimitiveType,
  type NormalizedMockParameters,
} from '../types/MockParamater';
import { type DashboardConfig } from '../types/DashboardConfig';
import {
  type StateWithCreateScenarioSlice,
  selectIsScenarioActive,
} from './createScenario.slice';
import { type MockData } from '../types/MockData';
import mergeOwnTop from '../utils/mergeOwnTop';

export type CreateMockEntity = {
  mockKey: string;
  scenarioKey: string | undefined;
  parameters?: NormalizedMockParameters;
  data?: MockData;
  dashboardConfig?: DashboardConfig;
  isActive?: boolean;
  isExpanded?: boolean;
};

const configureMockAdapater = createEntityAdapter<CreateMockEntity, EntityId>({
  selectId: (mockEntry) =>
    configureMockId(mockEntry.mockKey, mockEntry.scenarioKey),
});

export const slice = createSlice({
  name: 'configureMock',
  initialState: () => configureMockAdapater.getInitialState(),
  reducers: {
    upsertOne: (
      state,
      {
        payload: { mockKey, scenarioKey, parameters, data, dashboardConfig },
      }: PayloadAction<CreateMockEntity>,
    ) => {
      const id = configureMockId(mockKey, scenarioKey);
      const prevState = state.entities[id];
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!prevState) {
        return configureMockAdapater.setOne(state, {
          mockKey,
          scenarioKey,
          parameters,
          data,
          dashboardConfig,
          isActive: dashboardConfig?.isActiveByDefault ?? true,
          isExpanded: false,
        });
      }

      return configureMockAdapater.upsertOne(state, {
        mockKey,
        scenarioKey,
        data: prevState.data ?? data,
        parameters:
          parameters && prevState.parameters
            ? mergeOwnTop(parameters, prevState.parameters)
            : parameters,
        dashboardConfig,
        isActive:
          prevState.isActive ?? dashboardConfig?.isActiveByDefault ?? true,
        isExpanded: prevState.isExpanded ?? false,
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
            MockParameterPrimitiveType | undefined | null
          >;
          data?: MockData;
          isActive?: boolean;
          isExpanded?: boolean;
        };
      }>,
    ) => {
      const entitiy = state.entities[configureMockId(mockKey, scenarioKey)];
      entitiy.data = changes.data ?? entitiy.data;
      Object.entries(changes.parameters || {}).forEach(([key, value]) => {
        const currentParameter = entitiy.parameters?.[key];
        if (!currentParameter) {
          throw new Error(
            `You are trying to update a parameter that does not exists; mockKey: ${mockKey}, scenarioKey: ${scenarioKey}`,
          );
        }
        if (value === null && !currentParameter.nullable) {
          return;
        }
        currentParameter.currentValue = value!;
      });
      entitiy.isActive = changes.isActive ?? entitiy.isActive;
      entitiy.isExpanded = changes.isExpanded ?? entitiy.isExpanded;
    },
    collapseEntities: (state, { payload }: PayloadAction<EntityId[]>) => {
      payload.forEach((id) => {
        state.entities[id].isExpanded = false;
      });
    },
    expandEntities: (state, { payload }: PayloadAction<EntityId[]>) => {
      payload.forEach((id) => {
        state.entities[id].isExpanded = true;
      });
    },
    deactiveEntities: (state, { payload }: PayloadAction<EntityId[]>) => {
      payload.forEach((id) => {
        state.entities[id].isActive = false;
      });
    },
    activateEntities: (state, { payload }: PayloadAction<EntityId[]>) => {
      payload.forEach((id) => {
        state.entities[id].isActive = true;
      });
    },
    resetAll: (state) => {
      state.ids.forEach((id) => {
        const parameters = state.entities[id].parameters;
        state.entities[id].isActive =
          state.entities[id].dashboardConfig?.isActiveByDefault ?? true;
        state.entities[id].isExpanded = false;
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
    pruneEntities: (state, { payload }: PayloadAction<EntityId[]>) => {
      state.ids.forEach((id) => {
        if (payload.includes(id)) return;
        delete state.entities[id];
        return false;
      });
      state.ids = payload;
    },
  },
});

export interface StateWithCreateMockSlice {
  [slice.name]: EntityState<CreateMockEntity, EntityId>;
}

export const configureMockActions = slice.actions;

export default slice.reducer;

const selectors = configureMockAdapater.getSelectors();

export const selectAllCreateMocks = (state: StateWithCreateMockSlice) =>
  selectors.selectAll(state.configureMock);
export const selectCreateMockById =
  (id: EntityId) => (state: StateWithCreateMockSlice) =>
    selectors.selectById(state.configureMock, id);

export const selectScenarioMocksById = createSelector(
  [(state) => selectAllCreateMocks(state), (_state, id: EntityId) => id],
  (entities, id) => entities.filter((mock) => mock.scenarioKey === id),
);

export type ScenarioOrMockKey = ScenarioKeyData | MockKeyData;

type ScenarioKeyData = {
  type: 'scenario';
  scenarioKey: string;
  mockKey?: undefined;
  mockKeys: string[];
};
type MockKeyData = {
  type: 'mock';
  scenarioKey?: undefined;
  mockKey: string;
  mockKeys?: undefined;
};

export const selectScenarioAndMockKeys = createSelector(
  [(state: StateWithCreateMockSlice) => state[slice.name].ids],
  (ids) =>
    ids.reduce<ScenarioOrMockKey[]>((acc, id, index) => {
      const { mockKey, scenarioKey: currentScenarioKey } = parseMockId(
        id.toString(),
      );
      const prevItem = acc[index - 1];
      const prevScenarioKey = prevItem?.scenarioKey;
      const belongsToPreviousScenario =
        currentScenarioKey && currentScenarioKey === prevScenarioKey;

      if (belongsToPreviousScenario) {
        acc[index - 1] = {
          ...prevItem,
          mockKeys: [...prevItem.mockKeys, mockKey],
        };
        return acc;
      }

      if (currentScenarioKey) {
        acc.push({
          scenarioKey: currentScenarioKey,
          type: 'scenario',
          mockKeys: [mockKey],
        });
        return acc;
      }
      acc.push({ mockKey, type: 'mock' });
      return acc;
    }, []),
);

export const selectAllNonScenarioMocks = (state: StateWithCreateMockSlice) =>
  selectAllCreateMocks(state).filter((mock) => !mock.scenarioKey);

export const selectAllNonScenarioMocksIds = (state: StateWithCreateMockSlice) =>
  selectAllNonScenarioMocks(state).map((mock) => mock.mockKey);

export const selectIsMockExpanded =
  (id: EntityId) => (state: StateWithCreateMockSlice) =>
    selectCreateMockById(id)(state).isExpanded;

export const selectIsOneMockExpanded = (state: StateWithCreateMockSlice) =>
  !!state[slice.name].ids.find(
    (id) => state[slice.name].entities[id].isExpanded,
  );
export const selectIsOneMockInactive = (state: StateWithCreateMockSlice) =>
  !!state[slice.name].ids.find(
    (id) => !state[slice.name].entities[id].isActive,
  );

export const selectIsMockActive =
  (id: EntityId) =>
  (state: StateWithCreateMockSlice & StateWithCreateScenarioSlice) => {
    const mock = selectCreateMockById(id)(state);
    if (mock.scenarioKey) {
      return !!selectIsScenarioActive(mock.scenarioKey)(state);
    }
    return mock.isActive;
  };

// ? Acceptable
export function configureMockId(
  mockKey: string,
  scenarioKey: string | undefined,
): EntityId {
  return `${
    scenarioKey ? `__scenarioKey__:${scenarioKey}` : ''
  }__mockKey__:${mockKey}`;
}

export function parseMockId(entityId: string): {
  scenarioKey?: string;
  mockKey: string;
} {
  const splittedOnMockKey = entityId.split('__mockKey__:');
  if (splittedOnMockKey[0]) {
    return {
      mockKey: splittedOnMockKey[1],
      scenarioKey: splittedOnMockKey[0].split('__scenarioKey__:')[1],
    };
  }
  return { mockKey: splittedOnMockKey[1] };
}
