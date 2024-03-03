import { Paper, Typography } from '@mui/material';
import ConfigTable from './ConfigTable';
import { Provider } from 'react-redux';
import { createStore } from '@dynamic-msw/core';
import { useEffect, useState } from 'react';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  return isLoaded ? (
    <Provider store={createStore(true, true)}>
      <Typography variant="h4" gutterBottom>
        Dynamic MSW dashboard
      </Typography>
      <Paper>
        <ConfigTable />
      </Paper>
    </Provider>
  ) : (
    <>Loading...</>
  );
}

export default App;
