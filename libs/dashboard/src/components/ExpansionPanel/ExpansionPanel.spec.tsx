import { render } from '@testing-library/react';

import ExpansionPanel from './ExpansionPanel';

describe('ExpansionPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ExpansionPanel />);
    expect(baseElement).toBeTruthy();
  });
});
