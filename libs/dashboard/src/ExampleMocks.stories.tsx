import type {
  ExampleResponse,
  VariatedExampleResponse,
} from '@dynamic-msw/mock-example';
import {
  setup,
  exampleEndpoint,
  variatedExampleEndpoint,
} from '@dynamic-msw/mock-example';
import type { ComponentMeta } from '@storybook/react';
import type { FC } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

interface State {
  example?: ExampleResponse;
  variatedExample?: VariatedExampleResponse;
}

const Template: FC = () => {
  const [state, setState] = useState<State>({});
  useEffect(() => {
    setup();
    fetch(exampleEndpoint)
      .then((res) => res.json())
      .then((data) => setState((state) => ({ ...state, example: data })));
    fetch(variatedExampleEndpoint)
      .then((res) => res.json())
      .then((data) =>
        setState((state) => ({ ...state, variatedExample: data }))
      );
  }, []);
  return !state.example || !state.variatedExample ? (
    <div>loading</div>
  ) : (
    <pre data-testid="fetched-example-state">
      {JSON.stringify(state, null, 2)}
    </pre>
  );
};

const Story: ComponentMeta<typeof Template> = {
  component: Template,
  title: 'Development/ExampleMocks',
};

export default Story;

export const Primary = Template.bind({});
Primary.args = {};
