import React from 'react';
import { render } from '@testing-library/react-native';

import { NoAuthoritiesScreen } from '../';

jest.mock('@react-navigation/native', () => {
  return {
    useFocusEffect: jest.fn(),
  };
});

it('no authorities screen matches snapshot', () => {
  const { asJSON } = render(<NoAuthoritiesScreen />);

  expect(asJSON()).toMatchSnapshot();
});
