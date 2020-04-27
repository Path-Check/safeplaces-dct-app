import 'react-native';

import { render, wait } from '@testing-library/react-native';
import React from 'react';

import LocationTracking from '../LocationTracking';

// TODO(#373): Skipped due to worker not exiting, hanging CI action
// eslint-disable-next-line jest/no-disabled-tests
it.skip('renders correctly', async () => {
  const { asJSON } = render(<LocationTracking />);

  await wait();

  expect(asJSON()).toMatchSnapshot();
});
