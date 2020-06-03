import { render } from '@testing-library/react-native';
import React from 'react';

import { ExposurePage } from '../ExposurePage';

jest.mock('../../../COVIDSafePathsConfig', () => {
  return {
    isGPS: true,
  };
});

it('may be exposed matches snapshot', () => {
  const { asJSON } = render(<ExposurePage />);

  expect(asJSON()).toMatchSnapshot();
});
