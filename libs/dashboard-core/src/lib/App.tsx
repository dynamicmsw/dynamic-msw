import { Paper, Typography } from '@mui/material';
import ConfigTable from './ConfigTable';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<>loading</>} persistor={persistor!}>
        <Typography variant="h4" gutterBottom>
          Dynamic MSW dashboard
        </Typography>
        <Paper>
          <ConfigTable />
        </Paper>
      </PersistGate>
    </Provider>
  );
}

export default App;
