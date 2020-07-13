import React from 'react';
import { render } from '@testing-library/react-native';
import { useFocusEffect } from '@react-navigation/native';

import { NotificationsOffScreen } from '../';

jest.mock('@react-navigation/native');
useFocusEffect.mockReturnValue(jest.fn());
it('notifications off screen matches snapshot', () => {
  const { asJSON } = render(<NotificationsOffScreen />);

  expect(asJSON()).toMatchSnapshot();
});
