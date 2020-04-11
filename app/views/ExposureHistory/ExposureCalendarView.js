import React from 'react';
import styled from '@emotion/native';
import moment from 'moment';

/**
 * Calendar view of recent exposures.
 *
 * @param {{history: !import('../../constants/history').HistoryDay[]}} param0
 */
// eslint-disable-next-line no-unused-vars
export const ExposureCalendarView = ({ history }) => {
  const localeData = moment.localeData();

  moment();
  return (
    <Container>
      <DaysOfWeek>
        {localeData.weekdaysShort().map(d => (
          <DayHeader key={d}>{d}</DayHeader>
        ))}
      </DaysOfWeek>
    </Container>
  );
};

const Container = styled.View`
  height: 180px;
  padding: 4px;
`;

const DaysOfWeek = styled.View`
  flex-direction: row;
  flex: 1;
`;

const DayHeader = styled.Text`
  text-transform: uppercase;
  color: black;
  flex: 1;
`;
