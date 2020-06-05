import styled, { css } from '@emotion/native';
import dayjs from 'dayjs';
import React from 'react';

import { Typography } from '../../components';
import languages from '../../locales/languages';
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
  history.forEach((day) => {
    exposureMap[getDayKey(day.date)] = day.exposureMinutes;
  });

  const lastMonth = dayjs().subtract(1, 'month');

  // TODO: this could do with better i18n
  const title = `${lastMonth.format('MMMM')}/${dayjs().format('MMMM')}`;

  return (
    <>
      <Typography use='headline3'>{title}</Typography>
      <MonthGrid
        weeks={weeks}
        renderDayHeader={(d) => <DayOfWeek key={d}>{d}</DayOfWeek>}
        renderDay={(date) => {
          const exposureMinutes = exposureMap[getDayKey(date)];
          return (
            <CalendarDay
              highlightIfToday
              date={date}
              exposureMinutes={exposureMinutes}
            />
          );
        }}
      />
      <LegendRow>
        <LegendItem riskLevel={Risk.None}>
          {languages.t('history.no_exposure')}
        </LegendItem>
        <LegendItem riskLevel={Risk.Possible}>
          {languages.t('history.possible_exposure')}
        </LegendItem>
        <LegendItem riskLevel={Risk.Unknown}>
          {languages.t('label.no_data')}
        </LegendItem>
      </LegendRow>
    </>
  );
};

const LegendRow = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 16px;
  flex-wrap: wrap;
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
