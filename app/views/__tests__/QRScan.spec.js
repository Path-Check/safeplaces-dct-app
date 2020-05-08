import 'react-native';

import { render, wait } from '@testing-library/react-native';
import React from 'react';

import QRScan from '../QRScan';

it('renders correctly', async () => {
  const createTestProps = props => ({
    navigation: {
      addListener: jest.fn(),
    },
    ...props,
  });
  const props = createTestProps({});
  const { asJSON } = render(<QRScan {...props} />);
  await wait();

  expect(asJSON()).toMatchSnapshot();
});
