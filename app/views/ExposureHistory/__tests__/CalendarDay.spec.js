import React from 'react';
import { render } from '@testing-library/react-native';
import moment from 'moment';

import { CalendarDay } from '../CalendarDay';

const FIXED_DATE = moment('2020-04-11').startOf('day');

it('possible exposure matches snapshot', () => {
  const { asJSON } = render(
    <CalendarDay date={FIXED_DATE} exposureMinutes={5} />,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('no exposure matches snapshot', () => {
  const { asJSON } = render(
    <CalendarDay date={FIXED_DATE} exposureMinutes={5} />,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('unknown exposure matches snapshot', () => {
  const { asJSON } = render(
    <CalendarDay date={FIXED_DATE} exposureMinutes={undefined} />,
  );

  expect(asJSON()).toMatchSnapshot();
});
