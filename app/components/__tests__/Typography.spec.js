import { render } from '@testing-library/react-native';
import React from 'react';

import { Typography } from '../Typography';

it('headline1 is large and bold', () => {
  const { asJSON } = render(<Typography use='headline1'>headline1</Typography>);

  expect(asJSON()).toMatchSnapshot();
});

it('body1 is regular', () => {
  const { asJSON } = render(<Typography use='body1'>body1</Typography>);

  expect(asJSON()).toMatchSnapshot();
});
