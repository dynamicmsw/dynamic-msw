import { combineReducers } from "@reduxjs/toolkit";
import createMock from "./createMock.slice";
import createScenario from "./createScenario.slice";

const rootReducer = combineReducers({
  createMock,
  createScenario,
});

export default rootReducer;
