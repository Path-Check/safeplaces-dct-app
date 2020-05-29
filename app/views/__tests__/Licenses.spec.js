import 'react-native';

import { render } from '@testing-library/react-native';
import React from 'react';

import { LicensesScreen } from '../Licenses';

jest.mock('../../COVIDSafePathsConfig', () => {
  return {
    config: { tracingStrategy: 'gps' },
  };
});

it('renders correctly', () => {
  const { asJSON } = render(<LicensesScreen />);

  expect(asJSON()).toMatchSnapshot();
});
