import React from 'react';
import styled from '@emotion/native';
import moment from 'moment';

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
 *   date: moment.Moment,
 *   exposureTime?: number,
 *   showMonthLabel?: boolean
 *   showToday?: boolean
 * }} param0
 */
export const CalendarDay = ({
  date,
  exposureTime,
  showToday = false,
  showMonthLabel = false,
}) => {
  let riskLevel = Risk.Unknown;

  if (exposureTime > 0) {
    riskLevel = Risk.Possible;
  }
  if (exposureTime === 0) {
    riskLevel = Risk.None;
  }

  const today = moment();
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
  // border: 1px solid green;
  padding: 4px;
`;

const BG_COLOR_MAP = {
  [Risk.None]: '#41dca4',
  [Risk.Possible]: '#ffc000',
  [Risk.Unknown]: 'white',
  [Risk.Today]: 'white',
};

const BORDER_COLOR = {
  [Risk.Unknown]: '#dadada',
  [Risk.Today]: 'black',
};

const getBgColor = ({ riskLevel }) => BG_COLOR_MAP[riskLevel];
const getBorderColor = ({ riskLevel }) =>
  `1px solid ${BORDER_COLOR[riskLevel] || 'transparent'}`;

const Circle = styled.View`
  background-color: ${getBgColor};
  border: ${getBorderColor};
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
  font-family: 'IBM Plex Mono';
  font-size: 9px;
  font-weight: bold;
  letter-spacing: 1.5px;
  line-height: 20px;
  line-height: 20px;
  text-align: center;
  text-transform: uppercase;
`;
