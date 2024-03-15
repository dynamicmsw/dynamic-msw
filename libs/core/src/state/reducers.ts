import { combineReducers } from '@reduxjs/toolkit';
import mockParameters from './mock/mockParameters.slice';
import mockData from './mock/mockData.slice';
import mockDashboard from './mock/mockDashboard.slice';
import scenario from './scenario.slice';
import dashboard from './dashboard.slice';

const rootReducer = combineReducers({
  mockParameters,
  mockData,
  mockDashboard,
  scenario,
  dashboard,
});

export default rootReducer;
