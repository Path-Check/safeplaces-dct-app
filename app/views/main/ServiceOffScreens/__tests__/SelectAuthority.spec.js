import React from 'react';
import { render } from '@testing-library/react-native';

import { SelectAuthorityScreen } from '../';

it('select authority screen matches snapshot', () => {
  const { asJSON } = render(<SelectAuthorityScreen />);

  expect(asJSON()).toMatchSnapshot();
});
