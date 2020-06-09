import styled from '@emotion/native';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import React from 'react';

dayjs.extend(localeData);

/**
 * Get an array of daily dates between start and end.
 *
 * @param {dayjs.Dayjs} start
 * @param {dayjs.Dayjs} end
 * @returns {dayjs.Dayjs[]}
 */
export function daysBetween(start, end, interval = 'day') {
  const days = [];
  let d = start;
  while (d.isBefore(end, interval) || d.isSame(end, interval)) {
    days.push(d);
    d = d.add(1, interval);
  }
  return days;
}

/**
 * Render a grid of days grouped by rows of n weeks.
 *
 * @param {{
 *   date?: dayjs.Dayjs,
 *   weeks?: number,
 *   renderDayHeader: (d: string) => import('react').ReactNode
 *   renderDay: (d: dayjs.Dayjs) => import('react').ReactNode
 * }} param0
 */
export const MonthGrid = ({
  date = dayjs(),
  weeks = 3,
  renderDayHeader,
  renderDay,
}) => {
  if (!renderDay || !renderDayHeader) {
    throw new Error('renderDay and renderDayHeader are required');
  }

  const headers = dayjs.localeData().weekdaysShort(); // 'mon', 'tue', ...

  const start = date
    .startOf('day')
    .startOf('week')
    .subtract(weeks - 1, 'week');

  const end = date.startOf('day').endOf('week');

  /** @type {dayjs.Dayjs[]} */
  const days = daysBetween(start, end, 'day');

  return (
    <Container>
      <HeaderRow>
        {headers.map((day) => (
          <CellWrapper key={day}>{renderDayHeader(day)}</CellWrapper>
        ))}
      </HeaderRow>
      <DateGrid>
        {days.map((day) => (
          <CellWrapper key={day.format()}>{renderDay(day)}</CellWrapper>
        ))}
      </DateGrid>
    </Container>
  );
};

const Container = styled.View`
  margin: 0 -8px; // offsets some of the percentage based cell padding
`;

const HeaderRow = styled.View`
  flex-direction: row;
`;

const DAYS_PER_WEEK = 7;

const CELL_WIDTH_PERCENT = (100 / DAYS_PER_WEEK).toFixed(0);

const DateGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const CellWrapper = styled.View`
  flex: 1;
  flex-basis: ${CELL_WIDTH_PERCENT}%;
  align-items: center;
  justify-content: center;
  min-height: 20px; // for the header text
`;
