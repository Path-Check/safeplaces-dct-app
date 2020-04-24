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

it('changes color based on theme', () => {
  const { asJSON } = render(
    <>
      <Theme use='charcoal'>
        <Typography use='body1'>white</Typography>
      </Theme>
      <Theme use='default'>
        <Typography use='body1'>violet</Typography>
      </Theme>
    </>,
  );

  expect(asJSON()).toMatchSnapshot();
});
