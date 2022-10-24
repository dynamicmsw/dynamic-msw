import type { ExampleResponse } from '@dynamic-msw/mock-example';
import { setup, exampleEndpoint } from '@dynamic-msw/mock-example';
import type { ComponentMeta } from '@storybook/react';
import type { FC } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

const Template: FC = () => {
  const [state, setState] = useState<ExampleResponse>();
  useEffect(() => {
    setup();
    fetch(exampleEndpoint)
      .then((res) => res.json())
      .then(setState);
  }, []);
  return <div>exampleMock: {JSON.stringify(state)}</div>;
};

const Story: ComponentMeta<typeof Template> = {
  component: Template,
  title: 'Development/ExampleMocks',
};

export default Story;

export const Primary = Template.bind({});
Primary.args = {};
