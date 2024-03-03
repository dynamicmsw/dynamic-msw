import { Box, Typography } from '@mui/material';

export default function DashboardButton() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90dvh',
      }}
    >
      <Typography>Button is located at the bottom right corner</Typography>
    </Box>
  );
}
