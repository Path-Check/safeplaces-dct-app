import { render } from '@testing-library/react-native';
import React from 'react';

import { OffPage } from '../OffPage';

it('setting off matches snapshot', () => {
  const { asJSON } = render(<OffPage />);

  expect(asJSON()).toMatchSnapshot();
});
