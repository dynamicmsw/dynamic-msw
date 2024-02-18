import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type DashboardDisplayFilter =
  | 'mocks'
  | 'scenarios'
  | 'mocks-and-scenarios';
export type DashboardState = {
  openPageURL: string | null;
  searchQuery: string | null;
  displayFilter: 'mocks' | 'scenarios' | 'mocks-and-scenarios';
};

const initialState: DashboardState = {
  openPageURL: null,
  searchQuery: null,
  displayFilter: 'mocks-and-scenarios',
};

const getInitialState = () => initialState;

export const slice = createSlice({
  name: 'dashboard',
  initialState: () => initialState,
  reducers: {
    setOpenPageURL: (state, { payload }: PayloadAction<string | null>) => {
      state.openPageURL = payload;
    },
    setSearchQuery: (state, { payload }: PayloadAction<string | null>) => {
      state.searchQuery = payload;
    },
    setDisplayFilter: (
      state,
      { payload }: PayloadAction<DashboardDisplayFilter>
    ) => {
      state.displayFilter = payload;
    },
    reset: getInitialState,
    reloadPage: () => {
      window.location.reload();
    },
  },
});

export interface StateWithDashboardSlice {
  [slice.name]: DashboardState;
}

export const dashboardActions = slice.actions;

export default slice.reducer;

export const selectSearchQuery = (state: StateWithDashboardSlice) =>
  state.dashboard.searchQuery;

export const selectOpenPageURL = (state: StateWithDashboardSlice) =>
  state.dashboard.openPageURL;

export const selectDisplayFilter = (state: StateWithDashboardSlice) =>
  state.dashboard.displayFilter;
