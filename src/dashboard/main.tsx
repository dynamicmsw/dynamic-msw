import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import { createStore } from "../state/store";
import "./temp-test";

setTimeout(() => {
  const { store, persistor } = createStore(true, true);
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={<>loading</>} persistor={persistor!}>
          <App />
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
}, 100);
