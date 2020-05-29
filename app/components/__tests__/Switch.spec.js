import { render } from '@testing-library/react-native';
import React from 'react';

import { Switch } from '../Switch';

it('renders as off by default', () => {
  const { asJSON } = render(<Switch />);
  expect(asJSON()).toMatchSnapshot();
});

it('renders on', () => {
  const value = true;
  const { asJSON } = render(<Switch value={value} />);
  expect(asJSON()).toMatchSnapshot();
});
