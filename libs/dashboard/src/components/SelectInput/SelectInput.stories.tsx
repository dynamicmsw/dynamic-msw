import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { SelectInput } from './SelectInput';

const Story: ComponentMeta<typeof SelectInput> = {
  component: SelectInput,
  title: 'SelectInput',
};
export default Story;

const Template: ComponentStory<typeof SelectInput> = (args) => (
  <SelectInput {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
