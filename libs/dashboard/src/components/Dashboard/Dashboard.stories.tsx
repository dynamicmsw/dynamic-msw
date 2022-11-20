import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { Dashboard } from './Dashboard';

const Story: ComponentMeta<typeof Dashboard> = {
  component: Dashboard,
  title: 'Dashboard',
};

(global as any).__mock_page = process.env.STORYBOOK_PREVIEW
  ? './iframe.html?id=preview-mockedresponsedata--primary'
  : './iframe.html?id=hidden-examplemocks--primary';

export default Story;

const Template: ComponentStory<typeof Dashboard> = (args) => (
  <Dashboard {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
