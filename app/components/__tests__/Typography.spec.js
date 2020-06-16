import { render } from '@testing-library/react-native';
import React from 'react';

import { Theme } from '../../constants/themes';
import { Typography } from '../Typography';

it('headline1 is large and bold', () => {
  const { asJSON } = render(
    <Theme>
      <Typography use='headline1'>headline1</Typography>
    </Theme>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('body1 is regular', () => {
  const { asJSON } = render(
    <Theme>
      <Typography use='body1'>body1</Typography>
    </Theme>,
  );

  expect(asJSON()).toMatchSnapshot();
});
