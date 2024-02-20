import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';
import './temp-test';
import { createStore } from '@dynamic-msw/core';

setTimeout(() => {
  const { store, persistor } = createStore(true, true);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={<>loading</>} persistor={persistor!}>
          <App />
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
}, 100);
