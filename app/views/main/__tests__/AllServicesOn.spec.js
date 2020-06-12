import { cleanup, render } from '@testing-library/react-native';
import React from 'react';

import { AllServicesOnScreen } from '../AllServicesOn';

afterEach(cleanup);

jest.mock('react-native-pulse');

it('all services on matches snapshot', () => {
  const { asJSON } = render(<AllServicesOnScreen />);

  expect(asJSON()).toMatchSnapshot();
});
