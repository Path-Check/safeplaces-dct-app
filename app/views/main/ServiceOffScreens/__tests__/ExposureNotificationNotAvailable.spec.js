import React from 'react';
import { render } from '@testing-library/react-native';

import { ExposureNotificationNotAvailableScreen } from '../';

it('exposure notifications not available screen matches snapshot', () => {
  const { asJSON } = render(<ExposureNotificationNotAvailableScreen />);

  expect(asJSON()).toMatchSnapshot();
});
