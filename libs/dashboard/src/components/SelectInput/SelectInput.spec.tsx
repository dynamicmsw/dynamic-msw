import { render } from '@testing-library/react';

import SelectInput from './SelectInput';

describe('SelectInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SelectInput />);
    expect(baseElement).toBeTruthy();
  });
});
