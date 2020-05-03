import 'react-native';

import { render, wait } from '@testing-library/react-native';
import React from 'react';

import { NewsScreen } from '../News';

it('renders correctly', async () => {
  const { asJSON } = render(<NewsScreen />);
  await wait();

  expect(asJSON()).toMatchSnapshot();
});
