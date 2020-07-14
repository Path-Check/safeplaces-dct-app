import React from 'react';
import { render } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';

import { SelectAuthorityScreen } from '../';

jest.mock('@react-navigation/native');
useNavigation.mockReturnValue({ navigate: jest.fn() });
it('select authority screen matches snapshot', () => {
  const { asJSON } = render(<SelectAuthorityScreen />);

  expect(asJSON()).toMatchSnapshot();
});
