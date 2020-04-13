import styled, { css } from '@emotion/native';
import React from 'react';

import { Typography } from '../../components/Typography';
import { CalendarDay, DayOfWeek } from './CalendarDay';
import { DataCircle, Risk } from './DataCircle';
import { MonthGrid } from './MonthGrid';

/**
 * Get a date key that does not include time.
 *
 * @param {import('dayjs').Dayjs} date
 */
function getDayKey(date) {
  return date.startOf('day').unix();
}

/**
 * Calendar view of recent exposures.
 *
 * @param {{
 *   history: !import('../../constants/history').HistoryDay[],
 *   weeks?: number,
 * }} param0
 */
export const ExposureCalendarView = ({ history, weeks }) => {
  /** @type {{[date: string]: number}} */
  const exposureMap = {};
  history.forEach(day => {
    exposureMap[getDayKey(day.date)] = day.exposureMinutes;
  });

  return (
    <>
      <MonthGrid
        weeks={weeks}
        renderDayHeader={d => <DayOfWeek key={d}>{d}</DayOfWeek>}
        renderDay={date => {
          const exposureMinutes = exposureMap[getDayKey(date)];
          return (
            <CalendarDay
              showToday
              date={date}
              exposureMinutes={exposureMinutes}
            />
          );
        }}
      />
      <LegendRow>
        <LegendItem riskLevel={Risk.None}>No exposure</LegendItem>
        <LegendItem riskLevel={Risk.Possible}>Possible exposure</LegendItem>
        <LegendItem riskLevel={Risk.Unknown}>No data</LegendItem>
      </LegendRow>
    </>
  );
};

const LegendRow = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 16px;
`;

const LegendItem = ({ children, riskLevel }) => {
  return (
    <LegendItemContainer>
      <DataCircle size={9} riskLevel={riskLevel} />
      <Typography
        secondary
        use='body3'
        style={css`
          margin-left: 6px;
        `}>
        {children}
      </Typography>
    </LegendItemContainer>
  );
};

const LegendItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 16px;
  margin-left: 8px;
`;
