import { combineReducers } from '@reduxjs/toolkit';
import createMock from './createMock.slice';
import createScenario from './createScenario.slice';
import dashboard from './dashboard.slice';

const rootReducer = combineReducers({
  createMock,
  createScenario,
  dashboard,
});

export default rootReducer;
