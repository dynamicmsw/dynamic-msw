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
  dashboardConfig?: DashboardConfig;
};

const createScenarioAdapter = createEntityAdapter<CreateScenarioEntity>();

export const slice = createSlice({
  name: 'createScenario',
  initialState: () => createScenarioAdapter.getInitialState(),
  reducers: {
    setOne: (state, { payload }: PayloadAction<CreateScenarioEntity>) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const wasActive = state.entities[payload.id]?.isActive;
      createScenarioAdapter.setOne(state, {
        ...payload,
        isActive: payload.isActive ?? wasActive ?? true,
      });
    },
    updateOne: (
      state,
      {
        payload: { changes, id },
      }: PayloadAction<{ changes: Partial<CreateScenarioEntity>; id: string }>
    ) =>
      createScenarioAdapter.updateOne(state, {
        changes,
        id,
      }),
  },
});

export interface StateWithCreateScenarioSlice {
  [slice.name]: EntityState<CreateScenarioEntity, string>;
}

export const createScenarioActions = slice.actions;

export default slice.reducer;
const selectors = createScenarioAdapter.getSelectors();

export const selectCreateScenarioById =
  (id: string) => (state: StateWithCreateScenarioSlice) =>
    selectors.selectById(state.createScenario, id);

export const selectActiveSortedCreateScenarioIds = (
  state: StateWithCreateScenarioSlice
) =>
  selectors
    .selectIds(state.createScenario)
    .slice()
    .sort((a, b) => {
      if (
        state.createScenario.entities[b].isActive ===
        state.createScenario.entities[a].isActive
      ) {
        return 0;
      }
      return state.createScenario.entities[b].isActive ? 1 : -1;
    });

export const selectIsScenarioActive =
  (id: string) => (state: StateWithCreateScenarioSlice) =>
    selectCreateScenarioById(id)(state).isActive;
