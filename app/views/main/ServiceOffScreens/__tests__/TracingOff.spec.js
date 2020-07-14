import { render } from '@testing-library/react-native';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { TracingOffScreen } from '../';

jest.mock('@react-navigation/native');
useFocusEffect.mockReturnValue(jest.fn());

it('tracing off screen matches snapshot', () => {
  const { asJSON } = render(<TracingOffScreen />);

  expect(asJSON()).toMatchSnapshot();
});
