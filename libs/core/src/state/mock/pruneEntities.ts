import {
  type EntityId,
  type PayloadAction,
  createAction,
} from '@reduxjs/toolkit';
import {
  type DraftableEntityState,
  type EntityStateAdapter,
} from '@reduxjs/toolkit/dist/entities/models';

export const pruneMockEntitiesAction = createAction<EntityId[]>(
  'PRUNE_MOCK_ENTITIES',
);
export function getPruneEntitiesReducer<TState>(
  removeOne: EntityStateAdapter<TState, EntityId>['removeOne'],
) {
  return (
    state: DraftableEntityState<TState, EntityId>,
    { payload }: PayloadAction<EntityId[]>,
  ) => {
    state.ids.forEach((id) => {
      if (payload.includes(id)) return;
      removeOne(state, id);
    });
    return state;
  };
}
