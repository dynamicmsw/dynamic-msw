/// <reference types="redux" />
/// <reference types="redux-thunk" />

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import {
  createStateSyncMiddleware,
  initMessageListener,
} from 'redux-state-sync';
import storage from 'redux-persist/lib/storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const ignoredActions = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER];
const persistedReducer = persistReducer(
  {
    key: 'dynamic-msw',
    version: 1,
    storage,
  },
  rootReducer
);
export const createStore = (
  persistToLocalStorage = false,
  broadcastSync = false
) => {
  const store = configureStore({
    reducer: persistToLocalStorage
      ? persistedReducer
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (rootReducer as any),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware(
        persistToLocalStorage
          ? {
              serializableCheck: {
                ignoredActions,
              },
            }
          : undefined
      ).concat(
        broadcastSync
          ? (createStateSyncMiddleware({
              blacklist: ignoredActions,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }) as any)
          : []
      ),
  });
  if (broadcastSync) {
    initMessageListener(store);
  }
  const persistor = persistToLocalStorage ? persistStore(store) : undefined;
  return { store, persistor };
};

type CreateStore = ReturnType<typeof createStore>;
export type Store = CreateStore['store'];
export type RootState = ReturnType<Store['getState']>;
export type AppDispatch = Store['dispatch'];

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
