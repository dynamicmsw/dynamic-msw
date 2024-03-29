import type { Meta, StoryFn } from '@storybook/react';
import { DashboardApp } from '@dynamic-msw/dashboard-core';
import './test-utils/dashboardSetup';

const meta: Meta<typeof DashboardApp> = {
  component: DashboardApp,
};

export default meta;

export const Primary: StoryFn = () => {
  return <DashboardApp />;
};
