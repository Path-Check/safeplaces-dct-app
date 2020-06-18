import React from 'react';
import { render } from '@testing-library/react-native';

import { NotificationsOffScreen } from '../';

it('notifications off screen matches snapshot', () => {
  const { asJSON } = render(<NotificationsOffScreen />);

  expect(asJSON()).toMatchSnapshot();
});
