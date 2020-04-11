import React from 'react';
import { render } from '@testing-library/react-native';
import { CalendarDay } from '../CalendarDay';
import moment from 'moment';

const FIXED_DATE = moment('2020-04-11T22:29:02.756Z');

it('possible exposure matches snapshot', () => {
  const { asJSON } = render(<CalendarDay date={FIXED_DATE} exposureTime={5} />);

  expect(asJSON()).toMatchSnapshot();
});

it('no exposure matches snapshot', () => {
  const { asJSON } = render(<CalendarDay date={FIXED_DATE} exposureTime={5} />);

  expect(asJSON()).toMatchSnapshot();
});

it('unknown exposure matches snapshot', () => {
  const { asJSON } = render(
    <CalendarDay date={FIXED_DATE} exposureTime={undefined} />,
  );

  expect(asJSON()).toMatchSnapshot();
});
