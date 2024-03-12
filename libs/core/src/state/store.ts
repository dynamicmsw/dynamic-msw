/// <reference types="redux" />
/// <reference types="redux-thunk" />

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';
import { debounce } from 'lodash';
import { loadState, saveState } from './browserStorage';

export const createStore = (persistToLocalStorage = false) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: loadState(),
  });

  if (persistToLocalStorage) {
    store.subscribe(
      debounce(() => {
        saveState(store.getState());
      }, 100),
    );
  }

  return store;
};

type CreateStore = ReturnType<typeof createStore>;
export type Store = CreateStore;
export type RootState = ReturnType<Store['getState']>;
type AppDispatch = Store['dispatch'];

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
