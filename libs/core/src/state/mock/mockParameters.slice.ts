import {
  type EntityId,
  type EntityState,
  type PayloadAction,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import {
  type MockParameterPrimitiveType,
  type NormalizedMockParameters,
  type NormalizedMockParameter,
} from '../../configureMock/types/MockParamater';
import mergeOwnTop from '../../utils/mergeOwnTop';
import {
  pruneMockEntitiesAction,
  getPruneEntitiesReducer,
} from './pruneEntities';
import assertEntity from '../assertEntity';

export interface MockParametersEntity {
  id: EntityId;
  parameters: NormalizedMockParameters;
}

const mockParametersAdapter = createEntityAdapter<MockParametersEntity>();

export const slice = createSlice({
  name: 'mockParameters',
  initialState: () => mockParametersAdapter.getInitialState(),
  reducers: {
    initializeOne: (
      state,
      {
        payload: { id, parameters },
      }: PayloadAction<{
        id: MockParametersEntity['id'];
        parameters?: MockParametersEntity['parameters'];
      }>,
    ) => {
      if (!parameters) return mockParametersAdapter.removeOne(state, id);
      const prevState = state.entities[id];
      return mockParametersAdapter.setOne(state, {
        id,
        parameters:
          parameters && prevState?.parameters
            ? mergeOwnTop(parameters, prevState.parameters)
            : parameters,
      });
    },
    setOne: mockParametersAdapter.setOne,
    updateOne: (
      state,
      {
        payload: { id, changes },
      }: PayloadAction<{
        id: EntityId;
        changes: Record<string, MockParameterPrimitiveType | null>;
      }>,
    ) => {
      const entity = state.entities[id];
      assertEntity(entity);

      Object.entries(changes).forEach(([key, value]) => {
        const currentParameter = entity.parameters[key];
        assertParameter(currentParameter);
        currentParameter.currentValue = value;
      });
    },
    overrideOne: (
      state,
      {
        payload: { id, changes },
      }: PayloadAction<{
        id: EntityId;
        changes: Record<string, MockParameterPrimitiveType | null>;
      }>,
    ) => {
      const entity = state.entities[id];
      assertEntity(entity);
      Object.entries(changes).forEach(([key, value]) => {
        const currentParameter = entity.parameters[key];
        assertParameter(currentParameter);
        currentParameter.defaultValue = value;
      });
    },
    resetOne: (state, { payload }: PayloadAction<EntityId>) => {
      const entity = state.entities[payload];
      assertEntity(entity);
      const parameters = entity.parameters;
      assertParameters(parameters);
      Object.keys(parameters).forEach((key) => {
        const parameter = parameters[key];
        assertParameter(parameter);
        parameter.currentValue = undefined;
      });
    },
    resetAll: (state) => {
      state.ids.forEach((id) => {
        const entity = state.entities[id];
        assertEntity(entity);
        const parameters = entity.parameters;
        assertParameters(parameters);
        Object.keys(parameters).forEach((key) => {
          const parameter = parameters[key];
          assertParameter(parameter);
          parameter.currentValue = undefined;
        });
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      pruneMockEntitiesAction,
      getPruneEntitiesReducer(mockParametersAdapter.removeOne),
    );
  },
});

const sliceName = slice.name;

export interface StateWithMockParametersSlice {
  [sliceName]: EntityState<MockParametersEntity | undefined, EntityId>;
}

export const mockParametersActions = slice.actions;

export default slice.reducer;

export const selectMockParametersById =
  (id: EntityId) => (state: StateWithMockParametersSlice) =>
    state[sliceName].entities[id]?.parameters;

function assertParameter(
  parameter?: NormalizedMockParameter,
): asserts parameter {
  if (!parameter) {
    throw Error('Parameter does not exist');
  }
}
function assertParameters(
  parameters?: NormalizedMockParameters,
): asserts parameters {
  if (!parameters) {
    throw Error('Mock does not have parameters');
  }
}
