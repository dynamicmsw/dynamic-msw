import { setupPreview } from '@dynamic-msw/mock-example';
import type { ComponentMeta } from '@storybook/react';
import type { FC } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

type State = Record<
  keyof typeof endpoints,
  unknown[] | Record<string, unknown> | string
>;

const endpoints = {
  login: 'http://localhost:3001/login',
  featureFlags: 'http://localhost:3001/feature-flags',
  product: 'http://localhost:3001/products/:productID',
  productReviews: 'http://localhost:3001/products/:productID/reviews',
  allOptionTypes: 'http://localhost:3001/all-option-types',
};

const endpointKeys = Object.keys(endpoints) as Array<keyof typeof endpoints>;

const Template: FC = () => {
  const [state, setState] = useState<State>({} as State);

  useEffect(() => {
    setupPreview();
    endpointKeys.forEach((endpointKey) => {
      fetch(endpoints[endpointKey], {
        method: endpointKey === 'login' ? 'POST' : 'GET',
      })
        .then((res) => res.json())
        .then((data) =>
          setState((currentState) => ({ ...currentState, [endpointKey]: data }))
        )
        .catch(() => {
          setState((currentState) => ({
            ...currentState,
            [endpointKey]: 'Scenario inactive',
          }));
        });
    });
  }, []);

  const isReady = Object.keys(state).length === endpointKeys.length;

  return isReady ? (
    <pre>{JSON.stringify(state, null, 2)}</pre>
  ) : (
    <div>loading</div>
  );
};

const Story: ComponentMeta<typeof Template> = {
  component: Template,
  title: 'Preview/MockedResponseData',
};

export default Story;

export const Primary = Template.bind({});
Primary.args = {};
