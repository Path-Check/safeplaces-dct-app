import React from 'react';
import { render } from '@testing-library/react-native';

import { Theme } from '../themes';
import { Typography } from '../../components/Typography';

it('includes extra background View if setBackground=true', () => {
  const { asJSON } = render(
    <Theme use='dark' setBackground>
      <Typography use='headline1'>Text</Typography>
    </Theme>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('changes text color based on theme', () => {
  const { asJSON } = render(
    <>
      <Theme use='dark'>
        <Typography use='body1'>Text</Typography>
      </Theme>
      <Theme use='main'>
        <Typography use='body1'>Text</Typography>
      </Theme>
    </>,
  );

  expect(asJSON()).toMatchSnapshot();
});
