import { Paper, Typography } from '@mui/material';
import ConfigTable from './ConfigTable';
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <Typography variant="h4" gutterBottom>
        Dynamic MSW dashboard
      </Typography>
      <Paper>
        <ConfigTable />
      </Paper>
    </Provider>
  );
}

export default App;
