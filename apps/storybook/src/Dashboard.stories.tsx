import type { Meta, StoryFn } from '@storybook/react';
import { DashboardApp } from '@dynamic-msw/dashboard-core';
import useSetupStoryDashboard from './useSetupStoryDashboard';

const meta: Meta<typeof DashboardApp> = {
  component: DashboardApp,
};

export default meta;

export const Primary: StoryFn = () => {
  const { isReady } = useSetupStoryDashboard();
  return isReady ? <DashboardApp /> : <>Loading</>;
};
