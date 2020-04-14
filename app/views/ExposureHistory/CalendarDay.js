import styled from '@emotion/native';
import dayjs from 'dayjs';
import React from 'react';

import { DataCircle, Risk } from './DataCircle';

/**
 * Show a circular calendar day with risk level coloring.
 *
 * @param {{
 *   date: dayjs.Dayjs,
 *   exposureMinutes?: number,
 *   showMonthLabel?: boolean,
 *   highlightIfToday?: boolean,
 * }} param0
 */
export const CalendarDay = ({
  date,
  exposureMinutes,
  highlightIfToday = false,
  showMonthLabel = false,
}) => {
  let riskLevel = Risk.Unknown;

  const today = dayjs();
  if (highlightIfToday && today.isSame(date, 'day')) {
    riskLevel = Risk.Today;
  }

  // No risk is less important than "today"
  if (exposureMinutes === 0) {
    riskLevel = Risk.None;
  }

  // possible risk is more important than "today"
  if (exposureMinutes > 0) {
    riskLevel = Risk.Possible;
  }

  return (
    <DayContainer>
      {showMonthLabel && <DayOfWeek>{date.format('MMM')}</DayOfWeek>}
      <DataCircle size={36} riskLevel={riskLevel}>
        {date.format('D')}
      </DataCircle>
    </DayContainer>
  );
};

const DayContainer = styled.View`
  align-items: center;
  padding: 4px;
`;

export const DayOfWeek = styled.Text`
  color: ${({ theme }) => theme.textPrimaryOnBackground};
  font-family: 'IBM Plex Sans';
  font-size: 9px;
  font-weight: bold;
  letter-spacing: 1.5px;
  line-height: 20px;
  line-height: 20px;
  text-align: center;
  text-transform: uppercase;
`;
