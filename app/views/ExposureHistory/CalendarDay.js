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
 *   showMonthLabel?: boolean
 *   showToday?: boolean
 * }} param0
 */
export const CalendarDay = ({
  date,
  exposureMinutes,
  showToday = false,
  showMonthLabel = false,
}) => {
  let riskLevel = Risk.Unknown;

  if (exposureMinutes > 0) {
    riskLevel = Risk.Possible;
  }
  if (exposureMinutes === 0) {
    riskLevel = Risk.None;
  }

  const today = dayjs();
  if (showToday && today.isSame(date, 'day')) {
    riskLevel = Risk.Today;
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
