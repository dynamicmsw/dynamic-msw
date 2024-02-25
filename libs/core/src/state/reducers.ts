import { combineReducers } from '@reduxjs/toolkit';
import configureMock from './createMock.slice';
import configureScenario from './createScenario.slice';
import dashboard from './dashboard.slice';

const rootReducer = combineReducers({
  configureMock,
  configureScenario,
  dashboard,
});

export default rootReducer;
