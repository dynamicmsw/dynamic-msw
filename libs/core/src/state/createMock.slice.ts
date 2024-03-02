/// <reference types="reselect" />
import {
  EntityId,
  EntityState,
  PayloadAction,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { merge } from 'lodash';
import {
  MockParameterPrimitiveType,
  NormalizedMockParameters,
} from '../types/MockParamater';
import { DashboardConfig } from '../types/DashboardConfig';
import {
  StateWithCreateScenarioSlice,
  selectIsScenarioActive,
} from './createScenario.slice';
import { type MockData } from '../types/MockData';

export type CreateMockEntity = {
  mockKey: string;
  scenarioKey: string | undefined;
  parameters?: NormalizedMockParameters;
  initialData?: MockData;
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
      }: PayloadAction<CreateMockEntity>
    ) => {
      const id = configureMockId(mockKey, scenarioKey);
      const prevState = state.entities[id];
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!prevState) {
        return configureMockAdapater.setOne(state, {
          mockKey,
          scenarioKey,
          parameters,
          initialData: data,
          data,
          dashboardConfig,
          isActive: true,
          isExpanded: false,
        });
      }

      return configureMockAdapater.upsertOne(state, {
        mockKey,
        scenarioKey,
        initialData: data,
        parameters: merge(prevState.parameters, parameters),
        dashboardConfig,
        isActive: prevState.isActive ?? true,
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
      }>
    ) => {
      const entitiy = state.entities[configureMockId(mockKey, scenarioKey)];
      entitiy.data = changes.data ?? entitiy.data;
      Object.entries(changes.parameters || {}).forEach(([key, value]) => {
        const currentParameter = entitiy.parameters?.[key];
        if (!currentParameter) {
          throw new Error(
            `You are trying to update a parameter that does not exists; mockKey: ${mockKey}, scenarioKey: ${scenarioKey}`
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
        state.entities[id].isActive = true;
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
  (entities, id) => entities.filter((mock) => mock.scenarioKey === id)
);

export type ScenarioOrMockKey = {
  search: string;
} & (ScenarioKeyData | MockKeyData);

type ScenarioKeyData = {
  scenarioKey: string;
  mockKey?: undefined;
  mockKeys: string[];
};
type MockKeyData = {
  scenarioKey?: undefined;
  mockKey: string;
  mockKeys?: undefined;
};

export const selectOrderedScenariosAndMocks = createSelector(
  (state: StateWithCreateMockSlice) => state[slice.name].ids,
  (ids) =>
    ids.reduce((acc, id, index) => {
      const { mockKey, scenarioKey: currentScenarioKey } = parseMockId(
        id.toString()
      );
      const prevScenarioKey = acc[index - 1]?.scenarioKey;
      if (currentScenarioKey && currentScenarioKey === prevScenarioKey) {
        (acc[index - 1] as ScenarioKeyData) = {
          ...(acc[index - 1] as ScenarioKeyData),
          mockKeys: [...(acc[index - 1] as ScenarioKeyData).mockKeys, mockKey],
        };
        return acc;
      }
      if (currentScenarioKey) {
        acc.push({
          scenarioKey: currentScenarioKey,
          search: 'scenario',
          mockKeys: [mockKey],
        });
        return acc;
      }
      acc.push({ mockKey, search: 'mock' });
      return acc;
    }, [] as Array<ScenarioOrMockKey>)
);

export const selectAllNonScenarioMocks = (state: StateWithCreateMockSlice) =>
  selectAllCreateMocks(state).filter((mock) => !mock.scenarioKey);

export const selectAllNonScenarioMocksIds = (state: StateWithCreateMockSlice) =>
  selectAllNonScenarioMocks(state).map((mock) => mock.mockKey);

export const selectIsMockActive =
  (id: EntityId) =>
  (state: StateWithCreateMockSlice & StateWithCreateScenarioSlice) => {
    const mock = selectCreateMockById(id)(state);
    if (mock.scenarioKey) {
      return !!selectIsScenarioActive(mock.scenarioKey)(state);
    }
    return mock.isActive;
  };
export const selectIsMockExpanded =
  (id: EntityId) => (state: StateWithCreateMockSlice) =>
    selectCreateMockById(id)(state).isExpanded;

export const selectIsOneMockExpanded = (state: StateWithCreateMockSlice) =>
  !!state[slice.name].ids.find(
    (id) => state[slice.name].entities[id].isExpanded
  );
export const selectIsOneMockInactive = (state: StateWithCreateMockSlice) =>
  !!state[slice.name].ids.find(
    (id) => !state[slice.name].entities[id].isActive
  );

export function configureMockId(
  mockKey: string,
  scenarioKey: string | undefined
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
