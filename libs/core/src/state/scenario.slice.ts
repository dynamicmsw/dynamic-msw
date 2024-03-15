import {
  type EntityState,
  type PayloadAction,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';

import type MockAndScenarioDashboardState from '../types/MockAndScenarioDashboardState';
import assertEntity from './assertEntity';

export interface ScenarioEntity extends MockAndScenarioDashboardState<string> {
  mockKeys: string[];
}

const scenarioAdapter = createEntityAdapter<ScenarioEntity>();

const slice = createSlice({
  name: 'scenario',
  initialState: () => scenarioAdapter.getInitialState(),
  reducers: {
    initializeOne: (state, { payload }: PayloadAction<ScenarioEntity>) => {
      const wasActive = state.entities[payload.id]?.isActive;
      const wasExpanded = state.entities[payload.id]?.isExpanded;
      scenarioAdapter.setOne(state, {
        ...payload,
        isExpanded: payload.isExpanded ?? wasExpanded ?? false,
        isActive:
          payload.isActive ?? wasActive ?? payload.isActiveByDefault ?? true,
      });
    },
    updateOne: scenarioAdapter.updateOne,
    updateMany: scenarioAdapter.updateMany,
    resetAll: (state) => {
      state.ids.forEach((id) => {
        const entity = state.entities[id];
        assertEntity(entity);
        entity.isActive = entity.isActiveByDefault ?? true;
        entity.isExpanded = false;
      });
    },
    pruneEntities: (state, { payload }: PayloadAction<string[]>) => {
      state.ids.forEach((id) => {
        if (payload.includes(id)) return;
        scenarioAdapter.removeOne(state, id);
      });
      return state;
    },
  },
});

const sliceName = slice.name;

export interface StateWithScenarioSlice {
  [sliceName]: EntityState<ScenarioEntity, string>;
}

export const scenarioActions = slice.actions;

export default slice.reducer;

const selectors = scenarioAdapter.getSelectors();

export const selectScenarioById =
  (id: string) => (state: StateWithScenarioSlice) => {
    const entity = selectors.selectById(state[sliceName], id);
    assertEntity(entity);
    return entity;
  };

export const selectIsScenarioExpanded =
  (id: string) => (state: StateWithScenarioSlice) => {
    const scenario = selectScenarioById(id)(state);
    assertScenario(scenario);
    return scenario.isExpanded;
  };

export const selectIsOneScenarioExpanded = (state: StateWithScenarioSlice) =>
  !!state[sliceName].ids.find((id) => {
    const scenario = state[sliceName].entities[id];
    assertScenario(scenario);
    scenario.isExpanded;
  });

function assertScenario(entity?: ScenarioEntity): asserts entity {
  if (!entity) {
    throw Error(
      'Scenario does not exist. Ensure you pass the scenario to the `setupDashboard` or `setupHandlers` function.',
    );
  }
}
