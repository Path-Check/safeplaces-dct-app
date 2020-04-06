import 'react-native';
import React from 'react';
import {render, wait} from '@testing-library/react-native';
import LocationTracking from '../LocationTracking';

it('renders correctly', async () => {
  const {asJSON} = render(<LocationTracking />);

  await wait();

  expect(asJSON()).toMatchSnapshot();
});
