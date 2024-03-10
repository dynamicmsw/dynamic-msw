/// <reference types="redux" />
/// <reference types="redux-thunk" />

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import {
  createStateSyncMiddleware,
  initMessageListener,
} from 'redux-state-sync';
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';
import { debounce } from 'lodash';
import { loadState, saveState } from './browserStorage';

export const createStore = (
  persistToLocalStorage = false,
  broadcastSync = false,
) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        broadcastSync
          ? (createStateSyncMiddleware({
              channel: 'dynamic-msw',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }) as any)
          : [],
      ),
    preloadedState: loadState(),
  });
  if (persistToLocalStorage) {
    store.subscribe(
      debounce(() => {
        saveState(store.getState());
      }, 100),
    );
  }
  if (broadcastSync) {
    initMessageListener(store);
  }
  return store;
};

type CreateStore = ReturnType<typeof createStore>;
export type Store = CreateStore;
export type RootState = ReturnType<Store['getState']>;
export type AppDispatch = Store['dispatch'];

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
