import { render } from '@testing-library/react-native';
import React from 'react';

import Overlap from '../Overlap';

it('renders correctly', () => {
  const { asJSON } = render(<Overlap />);

  expect(asJSON()).toMatchSnapshot();
});
