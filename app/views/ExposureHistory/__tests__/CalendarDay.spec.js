import React from 'react';
import { render } from '@testing-library/react-native';
import dayjs from 'dayjs';

import { CalendarDay } from '../CalendarDay';
import { Theme } from '../../../constants/themes';

const FIXED_DATE = dayjs('2020-04-11').startOf('day');

it('possible exposure matches snapshot', () => {
  const { asJSON } = render(
    <Theme>
      <CalendarDay date={FIXED_DATE} exposureMinutes={5} />
    </Theme>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('no exposure matches snapshot', () => {
  const { asJSON } = render(
    <Theme>
      <CalendarDay date={FIXED_DATE} exposureMinutes={5} />
    </Theme>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('unknown exposure matches snapshot', () => {
  const { asJSON } = render(
    <Theme>
      <CalendarDay date={FIXED_DATE} exposureMinutes={undefined} />
    </Theme>,
  );

  expect(asJSON()).toMatchSnapshot();
});
