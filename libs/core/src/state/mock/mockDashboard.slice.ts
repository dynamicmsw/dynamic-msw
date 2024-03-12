/// <reference types="reselect" />
import {
  type EntityId,
  type EntityState,
  createEntityAdapter,
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { parseMockId } from './mockEntityId';
import type MockAndScenarioDashboardState from '../../types/MockAndScenarioDashboardState';
import {
  pruneMockEntitiesAction,
  getPruneEntitiesReducer,
} from './pruneEntities';
import mergeOwnTop from '../../utils/mergeOwnTop';
import { type DashboardConfig } from '../../types/DashboardConfig';
import assertEntity from '../assertEntity';

export type MockDashboardEntity = MockAndScenarioDashboardState<EntityId>;

const mockDashboardEntityAdapter = createEntityAdapter<MockDashboardEntity>();

const slice = createSlice({
  name: 'mockDashboard',
  initialState: () => mockDashboardEntityAdapter.getInitialState(),
  reducers: {
    initializeOne: (
      state,
      { payload }: PayloadAction<{ id: EntityId } & DashboardConfig>,
    ) => {
      const prevState = state.entities[payload.id];
      mockDashboardEntityAdapter.setOne(state, {
        ...(prevState ? mergeOwnTop(payload, prevState) : payload),
        id: payload.id,
        isActive: !!prevState?.isActive,
        isExpanded: !!prevState?.isExpanded,
      });
    },
    updateMany: mockDashboardEntityAdapter.updateMany,
    updateOne: mockDashboardEntityAdapter.updateOne,
    resetAll: (state) => {
      state.ids.forEach((id) => {
        const prev = state.entities[id];
        if (!prev) return;
        prev.isActive = prev.isActiveByDefault ?? true;
        prev.isExpanded = false;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      pruneMockEntitiesAction,
      getPruneEntitiesReducer(mockDashboardEntityAdapter.removeOne),
    );
  },
});

const sliceName = slice.name;

export interface StateWithMockDashboardSlice {
  [sliceName]: EntityState<MockDashboardEntity, EntityId>;
}

export const mockDashboardActions = slice.actions;

export default slice.reducer;

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

export const selectMockDashboardConfigById =
  (id: EntityId) => (state: StateWithMockDashboardSlice) => {
    const entity = state[sliceName].entities[id];
    assertEntity(entity);
    return entity;
  };

export const selectIsOneMockExpanded = (state: StateWithMockDashboardSlice) =>
  !!state[sliceName].ids.find(
    (id) => state[sliceName].entities[id]?.isExpanded,
  );

export const selectIsOneMockInactive = (state: StateWithMockDashboardSlice) =>
  !!state[sliceName].ids.find((id) => !state[sliceName].entities[id]?.isActive);

export const selectIsMockExpanded =
  (id: EntityId) => (state: StateWithMockDashboardSlice) =>
    !!selectMockDashboardConfigById(id)(state)?.isExpanded;

export const selectScenarioAndMockKeys = createSelector(
  [(state: StateWithMockDashboardSlice) => state[slice.name].ids],
  (ids) =>
    ids.reduce<ScenarioOrMockKey[]>((acc, id, index) => {
      const { mockKey, scenarioKey: currentScenarioKey } = parseMockId(
        id.toString(),
      );
      const prevItem = acc[index - 1];
      const prevScenarioKey = prevItem?.scenarioKey;
      const belongsToPreviousScenario =
        currentScenarioKey && currentScenarioKey === prevScenarioKey;

      if (belongsToPreviousScenario && prevItem) {
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
