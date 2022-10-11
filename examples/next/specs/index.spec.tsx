import { setup } from '@dynamic-msw/mock-example';
import { render, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import React from 'react';

import Index from '../pages/index';

describe('Index', () => {
  beforeAll(() => {
    setup(setupServer);
  });
  it('should include mocked data', async () => {
    const { getByTestId } = render(<Index />);
    await waitFor(() => {
      expect(getByTestId('test-mocked-data')).toHaveTextContent('yes');
    });
  });
  it('should update mocked data', async () => {
    jest.useFakeTimers();
    const { getByTestId } = render(<Index />);
    jest.advanceTimersByTime(4000);
    await waitFor(() => {
      expect(getByTestId('test-mocked-data')).toHaveTextContent('no');
    });
  });
});
