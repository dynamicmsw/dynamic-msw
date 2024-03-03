import type { Meta, StoryFn } from '@storybook/react';
import './test-utils/dashboardSetup';
import DashboardButton from './DashboardButton';

const meta: Meta<typeof DashboardButton> = {
  component: DashboardButton,
};

export default meta;

export const Primary: StoryFn = () => {
  return <DashboardButton />;
};
