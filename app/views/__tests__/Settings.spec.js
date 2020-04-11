import 'react-native';
import React from 'react';
import {render, wait} from '@testing-library/react-native';
import Settings from '../Settings';

it('renders correctly', async () => {
  const {asJSON} = render(<Settings />);
  await wait();

  expect(asJSON()).toMatchSnapshot();
});
