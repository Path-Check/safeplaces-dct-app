import 'react-native';
import React from 'react';
import {render, wait} from '@testing-library/react-native';
import LocationTracking from '../LocationTracking';

// TODO(#373): Skipped due to worker not exiting, hanging CI action
it.skip('renders correctly', async () => {
  const {asJSON} = render(<LocationTracking />);

  await wait();

  expect(asJSON()).toMatchSnapshot();
});
