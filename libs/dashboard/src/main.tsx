import React from 'react';
import ReactDOM from 'react-dom/client';
import { DashboardApp } from '@dynamic-msw/dashboard-core';
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DashboardApp />
  </React.StrictMode>,
);
