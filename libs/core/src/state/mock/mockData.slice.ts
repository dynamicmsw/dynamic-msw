import {
  type EntityId,
  type EntityState,
  type PayloadAction,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { type MockData } from '../../configureMock/types/MockData';
import {
  getPruneEntitiesReducer,
  pruneMockEntitiesAction,
} from './pruneEntities';

export interface MockDataEntity {
  id: EntityId;
  initialData: MockData;
  data: MockData;
}

const mockDataAdapter = createEntityAdapter<MockDataEntity>();

export const slice = createSlice({
  name: 'mockData',
  initialState: () => mockDataAdapter.getInitialState(),
  reducers: {
    initializeOne: (
      state,
      {
        payload: { id, initialData, data },
      }: PayloadAction<{
        id: MockDataEntity['id'];
        data?: MockDataEntity['data'];
        initialData?: MockDataEntity['data'];
      }>,
    ) => {
      if (!data || !initialData) {
        return mockDataAdapter.removeOne(state, id);
      }
      return mockDataAdapter.setOne(state, {
        id,
        data: state.entities[id]?.data ?? data,
        initialData,
      });
    },
    setOne: mockDataAdapter.setOne,
    updateOne: mockDataAdapter.updateOne,
    resetAll: (state) => {
      state.ids.forEach((id) => {
        const prevState = state.entities[id];
        if (!prevState) return;
        prevState.data = prevState.initialData;
      });
    },
    resetOne: (state, { payload }: PayloadAction<EntityId>) => {
      const prevState = state.entities[payload];
      if (!prevState) return;
      prevState.data = prevState.initialData;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      pruneMockEntitiesAction,
      getPruneEntitiesReducer(mockDataAdapter.removeOne),
    );
  },
});

const sliceName = slice.name;

export interface StateWithMockDataSlice {
  [sliceName]: EntityState<MockDataEntity | undefined, EntityId>;
}

export const mockDataActions = slice.actions;

export default slice.reducer;

export const selectMockDataById =
  (id: EntityId) => (state: StateWithMockDataSlice) =>
    state[sliceName].entities[id]?.data;
