import React from 'react';
import styled from '@emotion/native';
import moment from 'moment';
import { extendMoment } from 'moment-range';

const momentRange = extendMoment(moment);

/**
 * Render a grid of days grouped by rows of n weeks.
 *
 * @param {{
 *   weeks?: number,
 *   renderDayHeader: (d: string) => import('react').ReactNode
 *   renderDay: (d: moment.Moment) => import('react').ReactNode
 * }} param0
 */
export const MonthGrid = ({ weeks = 3, renderDayHeader, renderDay }) => {
  console.log('MonthGrid locale', moment.locale());

  const headers = moment.localeData().weekdaysShort(); // 'mon', 'tue', ...

  const start = moment()
    .startOf('week')
    .subtract(weeks - 1, 'week');

  const end = moment().endOf('week');

  const range = momentRange.range(start, end);
  // range.snapTo('day');

  /** @type {moment.Moment[]} */
  const days = Array.from(range.by('day'));

  return (
    <Container>
      <HeaderRow>
        {headers.map(day => (
          <CellWrapper key={day}>{renderDayHeader(day)}</CellWrapper>
        ))}
      </HeaderRow>
      <DateGrid>
        {days.map(day => (
          <CellWrapper key={day.format()}>{renderDay(day)}</CellWrapper>
        ))}
      </DateGrid>
    </Container>
  );
};

const Container = styled.View`
  margin: 0 -10px; // offsets some of the percentage based cell padding
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
