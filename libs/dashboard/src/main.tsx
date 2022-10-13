import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';
import { Dashboard } from './components/Dashboard/Dashboard';

ReactDOM.render(
  <React.StrictMode>
    <App>
      <Dashboard />
    </App>
  </React.StrictMode>,
  document.getElementById('root')
);
// hello
