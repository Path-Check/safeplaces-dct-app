import React from 'react';
import styled from '@emotion/native';
import dayjs from 'dayjs';
import Color from '../../constants/colors';

const Risk = {
  Unknown: 'unknown',
  None: 'none',
  Possible: 'possible',
  Today: 'today',
};

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
      <Circle riskLevel={riskLevel}>
        <CircleInnerText riskLevel={riskLevel}>
          {date.format('D')}
        </CircleInnerText>
      </Circle>
    </DayContainer>
  );
};

const DayContainer = styled.View`
  align-items: center;
  padding: 4px;
`;

/** Get bg color from risk level and theme warning/success */
const getBgColor = ({ riskLevel, theme }) => {
  if (riskLevel === Risk.Possible) {
    return theme.warning;
  }

  if (riskLevel === Risk.None) {
    return theme.success;
  }

  return Color.WHITE;
};

/** Get border color from theme and risk level */
const getBorder = ({ riskLevel, theme }) => {
  let color = 'transparent';

  if (riskLevel === Risk.Unknown) {
    color = theme.border;
  }

  if (riskLevel === Risk.Today) {
    color = theme.textPrimaryOnBackground;
  }

  return `1px solid ${color}`;
};

const Circle = styled.View`
  background-color: ${getBgColor};
  border: ${getBorder};
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  align-content: center;
  flex-direction: row;
`;

const TEXT_COLOR_MAP = {
  [Risk.None]: '#fff',
  [Risk.Possible]: '#fff',
  [Risk.Unknown]: '#dadada',
};

const CircleInnerText = styled.Text`
  color: ${({ riskLevel }) => TEXT_COLOR_MAP[riskLevel]};
  text-align: center;
  flex: 1;
  font-size: 12px;
  font-weight: bold;
`;

export const DayOfWeek = styled.Text`
  color: #707070;
  font-family: 'IBM Plex Sans';
  font-size: 9px;
  font-weight: bold;
  letter-spacing: 1.5px;
  line-height: 20px;
  line-height: 20px;
  text-align: center;
  text-transform: uppercase;
`;
