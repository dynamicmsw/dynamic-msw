import {
  EntityState,
  PayloadAction,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';

import { DashboardConfig } from '../types/DashboardConfig';

export type CreateScenarioEntity = {
  id: string;
  isActive?: boolean;
  isExpanded?: boolean;
  dashboardConfig?: DashboardConfig;
};

const configureScenarioAdapter = createEntityAdapter<CreateScenarioEntity>();

export const slice = createSlice({
  name: 'configureScenario',
  initialState: () => configureScenarioAdapter.getInitialState(),
  reducers: {
    setOne: (state, { payload }: PayloadAction<CreateScenarioEntity>) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const wasActive = state.entities[payload.id]?.isActive;
      const wasExpanded = state.entities[payload.id]?.isActive;
      configureScenarioAdapter.setOne(state, {
        ...payload,
        isExpanded: payload.isExpanded ?? wasExpanded ?? false,
        isActive: payload.isActive ?? wasActive ?? true,
      });
    },
    updateOne: (
      state,
      {
        payload: { changes, id },
      }: PayloadAction<{ changes: Partial<CreateScenarioEntity>; id: string }>
    ) =>
      configureScenarioAdapter.updateOne(state, {
        changes,
        id,
      }),
    resetAll: (state) => {
      state.ids.forEach((id) => {
        state.entities[id].isActive = true;
        state.entities[id].isExpanded = false;
      });
    },
    collapseEntities: (state, { payload }: PayloadAction<string[]>) => {
      payload.forEach((id) => {
        state.entities[id].isExpanded = false;
      });
    },
    expandEntities: (state, { payload }: PayloadAction<string[]>) => {
      payload.forEach((id) => {
        state.entities[id].isExpanded = true;
      });
    },
    deactiveEntities: (state, { payload }: PayloadAction<string[]>) => {
      payload.forEach((id) => {
        state.entities[id].isActive = false;
      });
    },
    activateEntities: (state, { payload }: PayloadAction<string[]>) => {
      payload.forEach((id) => {
        state.entities[id].isActive = true;
      });
    },
  },
});

export interface StateWithCreateScenarioSlice {
  [slice.name]: EntityState<CreateScenarioEntity, string>;
}

export const configureScenarioActions = slice.actions;

export default slice.reducer;
const selectors = configureScenarioAdapter.getSelectors();

export const selectCreateScenarioById =
  (id: string) => (state: StateWithCreateScenarioSlice) =>
    selectors.selectById(state.configureScenario, id);

export const selectActiveSortedCreateScenarioIds = (
  state: StateWithCreateScenarioSlice
) =>
  selectors
    .selectIds(state.configureScenario)
    .slice()
    .sort((a, b) => {
      if (
        state.configureScenario.entities[b].isActive ===
        state.configureScenario.entities[a].isActive
      ) {
        return 0;
      }
      return state.configureScenario.entities[b].isActive ? 1 : -1;
    });

export const selectIsScenarioActive =
  (id: string) => (state: StateWithCreateScenarioSlice) =>
    selectCreateScenarioById(id)(state).isActive;
export const selectIsScenarioExpanded =
  (id: string) => (state: StateWithCreateScenarioSlice) =>
    selectCreateScenarioById(id)(state).isExpanded;
export const selectIsOneScenarioExpanded = (
  state: StateWithCreateScenarioSlice
) =>
  !!state[slice.name].ids.find(
    (id) => state[slice.name].entities[id].isExpanded
  );
