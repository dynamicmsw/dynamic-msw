import { createStore } from '@dynamic-msw/core';

const { store, persistor } = createStore(true, true);

export { store, persistor };
