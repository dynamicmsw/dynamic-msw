import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { TextInput } from './TextInput';

const Story: ComponentMeta<typeof TextInput> = {
  component: TextInput,
  title: 'TextInput',
};
export default Story;

const Template: ComponentStory<typeof TextInput> = (args) => (
  <TextInput {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
