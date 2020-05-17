import { cleanup, render } from '@testing-library/react-native';
import React from 'react';

import { NoKnownExposure } from '../NoKnownExposure';

afterEach(cleanup);

jest.mock('react-native-pulse');

it('no known exposure matches snapshot', () => {
  const { asJSON } = render(<NoKnownExposure />);

  expect(asJSON()).toMatchSnapshot();
});
