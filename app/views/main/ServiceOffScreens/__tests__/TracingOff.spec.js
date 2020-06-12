import { render } from '@testing-library/react-native';
import React from 'react';

import { TracingOffScreen } from '../';

it('tracing off screen matches snapshot', () => {
  const { asJSON } = render(<TracingOffScreen />);

  expect(asJSON()).toMatchSnapshot();
});
