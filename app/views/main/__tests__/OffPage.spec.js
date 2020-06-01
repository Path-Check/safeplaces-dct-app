import { render } from '@testing-library/react-native';
import React from 'react';

import { OffPage } from '../OffPage';

jest.mock('../../../COVIDSafePathsConfig', () => {
  return {
    isGPS: true,
  };
});

it('setting off matches snapshot', () => {
  const { asJSON } = render(<OffPage />);

  expect(asJSON()).toMatchSnapshot();
});
