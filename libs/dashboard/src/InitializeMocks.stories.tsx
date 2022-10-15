import { setup } from '@dynamic-msw/mock-example';
import type { ComponentMeta } from '@storybook/react';
import type { FC } from 'react';
import { useEffect } from 'react';

const Template: FC = () => {
  useEffect(() => {
    setup();
  }, []);
  return <div>example page to initialize mocks from</div>;
};

const Story: ComponentMeta<typeof Template> = {
  component: Template,
  title: 'Development/InitializeMocks',
};

export default Story;

export const Primary = Template.bind({});
Primary.args = {};
