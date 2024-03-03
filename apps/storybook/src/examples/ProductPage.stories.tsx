import type { Meta, StoryFn } from '@storybook/react';
import ProductPage from './ProductPage';

const meta: Meta<typeof ProductPage> = {
  component: ProductPage,
};

export default meta;

export const Primary: StoryFn = () => {
  return <ProductPage />;
};
