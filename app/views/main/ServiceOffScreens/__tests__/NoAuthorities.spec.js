import React from 'react';
import { render } from '@testing-library/react-native';

import { NoAuthoritiesScreen } from '../';

it('no authorities screen matches snapshot', () => {
  const { asJSON } = render(<NoAuthoritiesScreen />);

  expect(asJSON()).toMatchSnapshot();
});
