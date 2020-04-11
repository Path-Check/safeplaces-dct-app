import React from 'react';
import styled from '@emotion/native';

const Risk = {
  Unknown: 'unknown',
  None: 'none',
  Possible: 'possible',
};

/**
 * Show a circular calendar day with risk level coloring.
 *
 * @param {{
 *   date: import('moment').Moment,
 *   exposureTime: ?number,
 *   showMonthLabel?: boolean
 * }} param0
 */
export const CalendarDay = ({ date, exposureTime, showMonthLabel = false }) => {
  let riskLevel = Risk.Unknown;

  if (exposureTime > 0) {
    riskLevel = Risk.Possible;
  }
  if (exposureTime === 0) {
    riskLevel = Risk.None;
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
`;

const BG_COLOR_MAP = {
  [Risk.None]: '#41dca4',
  [Risk.Possible]: '#ffc000',
  [Risk.Unknown]: 'white',
};

const Circle = styled.View`
  background-color: ${({ riskLevel }) => BG_COLOR_MAP[riskLevel]};
  border: ${({ riskLevel }) =>
    riskLevel === Risk.Unknown ? `1px solid #dadada` : undefined};
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

const DayOfWeek = styled.Text`
  font-size: 9px;
  font-weight: bold;
  text-transform: uppercase;
  color: #707070;
  letter-spacing: 1.5px;
  line-height: 20px;
`;
