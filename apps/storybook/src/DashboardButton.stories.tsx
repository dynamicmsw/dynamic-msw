import type { Meta, StoryFn } from '@storybook/react';
import useSetupStoryDashboard from './useSetupStoryDashboard';
import DashboardButton from './DashboardButton';
import { Box, Typography } from '@mui/material';

const meta: Meta<typeof DashboardButton> = {
  component: DashboardButton,
};

export default meta;

export const Primary: StoryFn = () => {
  const { isReady } = useSetupStoryDashboard();
  return isReady ? (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90dvh',
      }}
    >
      <Typography>Button is located at the bottom right corner</Typography>
      <DashboardButton />
    </Box>
  ) : (
    <>Loading</>
  );
};
