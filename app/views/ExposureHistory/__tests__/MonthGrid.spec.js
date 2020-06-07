import { render } from '@testing-library/react-native';
import dayjs from 'dayjs';
import MockDate from 'mockdate';
import React from 'react';

import { MonthGrid } from '../MonthGrid';

const NOW = dayjs('2020-01-09T00:00:00-08:00').startOf('day');

const renderDayHeader = (dayOfWeek) => <span>{dayOfWeek}</span>;
const renderDay = (date) => <span>{date.format('D')}</span>;

const renderProps = { renderDayHeader, renderDay };

beforeEach(() => {
  MockDate.set(NOW.valueOf());
});

afterEach(() => {
  MockDate.reset();
});

it('renderDay is required', () => {
  jest.spyOn(console, 'error').mockImplementation();
  expect(() =>
    render(<MonthGrid renderDayHeader={renderDayHeader} />),
  ).toThrow();
});

it('renderDayHeader is required', () => {
  jest.spyOn(console, 'error').mockImplementation();
  expect(() => render(<MonthGrid renderDay={renderDay} />)).toThrow();
});

it('with no input date, defaults to 3 weeks ago from today', () => {
  const { asJSON } = render(<MonthGrid {...renderProps} />);

  expect(asJSON()).toMatchSnapshot();
});

it('with input date, defaults to 3 weeks ago from that date', () => {
  const date = dayjs('2019-12-02').subtract();
  const { asJSON } = render(<MonthGrid date={date} {...renderProps} />);

  expect(asJSON()).toMatchSnapshot();
});

it('allows specifying number of weeks', () => {
  const { asJSON } = render(<MonthGrid {...renderProps} weeks={1} />);

  expect(asJSON()).toMatchSnapshot();
});
