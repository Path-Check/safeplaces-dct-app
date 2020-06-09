import { render } from '@testing-library/react-native';
import React from 'react';

import { Typography } from '../../components';
import { Theme } from '../themes';

it('includes extra background View if setBackground=true', () => {
  const { asJSON } = render(
    <Theme use='charcoal' setBackground>
      <Typography use='headline1'>Text</Typography>
    </Theme>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('changes text color based on theme', () => {
  const { asJSON } = render(
    <>
      <Theme use='charcoal'>
        <Typography use='body1'>Text</Typography>
      </Theme>
      <Theme use='default'>
        <Typography use='body1'>Text</Typography>
      </Theme>
    </>,
  );

  expect(asJSON()).toMatchSnapshot();
});
