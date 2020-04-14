import { render } from '@testing-library/react-native';
import dayjs from 'dayjs';
import MockDate from 'mockdate';
import React from 'react';

import { Theme } from '../../../constants/themes';
import { CalendarDay } from '../CalendarDay';

const FIXED_DATE = dayjs('2020-01-09T00:00:00-08:00').startOf('day');

beforeEach(() => {
  MockDate.set(FIXED_DATE.valueOf());
});

afterEach(() => {
  MockDate.reset();
});

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

it('today matches snapshot', () => {
  const { asJSON } = render(
    <Theme>
      <CalendarDay date={FIXED_DATE} exposureMinutes={undefined} />
    </Theme>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('no risk takes prio over today', () => {
  const { asJSON } = render(
    <Theme>
      <CalendarDay date={FIXED_DATE} exposureMinutes={0} />
    </Theme>,
  );

  expect(asJSON()).toMatchSnapshot();
});

it('some risk takes prio over today', () => {
  const { asJSON } = render(
    <Theme>
      <CalendarDay date={FIXED_DATE} exposureMinutes={5} />
    </Theme>,
  );

  expect(asJSON()).toMatchSnapshot();
});
