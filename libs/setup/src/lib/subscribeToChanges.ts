import { type Store, selectAllCreateMocks } from '@dynamic-msw/core';

export function subscribeToChanges(store: Store, handleUpdate: () => unknown) {
  let previousCreateMocks = selectAllCreateMocks(store.getState());
  return store.subscribe(() => {
    const currentCreateMocks = selectAllCreateMocks(store.getState());
    if (previousCreateMocks !== currentCreateMocks) {
      previousCreateMocks = currentCreateMocks;
      handleUpdate();
    }
  });
}
