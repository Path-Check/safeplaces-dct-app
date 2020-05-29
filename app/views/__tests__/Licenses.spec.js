import 'react-native';

import { render } from '@testing-library/react-native';
import React from 'react';

import { LicensesScreen } from '../Licenses';

jest.mock('../../COVIDSafePathsConfig', () => {
  return {
    isGPS: true,
  };
});

it('renders correctly', () => {
  const { asJSON } = render(<LicensesScreen />);

  expect(asJSON()).toMatchSnapshot();
});
