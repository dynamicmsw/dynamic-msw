import '../test-utils/dashboardSetup';

import { Box } from '@mui/material';
import AppBar from './AppBar';
import Product from './Product';

export default function ProductPage() {
  return (
    <>
      <AppBar />
      <Box sx={{ py: 4 }}>
        <Product />
      </Box>
    </>
  );
}
