import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ExpansionPanel } from './ExpansionPanel';

const Story: ComponentMeta<typeof ExpansionPanel> = {
  component: ExpansionPanel,
  title: 'ExpansionPanel',
};
export default Story;

const Template: ComponentStory<typeof ExpansionPanel> = (args) => (
  <ExpansionPanel {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
