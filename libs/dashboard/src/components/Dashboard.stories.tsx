import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { Dashboard } from './Dashboard';

const Story: ComponentMeta<typeof Dashboard> = {
  component: Dashboard,
  title: 'Dashboard',
};

(global as any).__mock_page =
  './iframe.html?id=preview-mockedresponsedata--primary';

export default Story;

const Template: ComponentStory<typeof Dashboard> = () => <Dashboard />;

export const Primary = Template.bind({});
Primary.args = {};
