import moment from 'moment';
import React from 'react';
import styled from '@emotion/native';
import { CalendarDay } from './CalendarDay';
import languages from '../../locales/languages';

/**
 * Details for a single day exposure.
 *
 * @param {!import('../../constants/history').HistoryDay} props
 */
export const SingleExposureDetail = ({ daysAgo, exposureTime }) => {
  const exposureTimeHuman = moment
    .duration(exposureTime * 60 * 1000)
    .humanize();

  const date = moment().subtract(daysAgo, 'day');

  // TODO: need today, not "a few seconds ago"
  const dateHumanized = date.startOf('day').calendar();

  return (
    <Container>
      <CalendarDay showMonthLabel date={date} exposureTime={exposureTime} />
      <DetailsBox>
        <Heading>{languages.t('history.possible_exposure')}</Heading>
        <SubheadingContainer>
          <SubheadingText>{exposureTimeHuman}</SubheadingText>
          <Divider />
          <SubheadingText>{dateHumanized}</SubheadingText>
        </SubheadingContainer>
        <BodyText>{languages.t('history.possible_exposure_para')}</BodyText>
      </DetailsBox>
    </Container>
  );
};

const Container = styled.View`
  align-items: stretch;
  flex-direction: row;
  margin-bottom: 20px;
  width: 100%;
`;

const DetailsBox = styled.View`
  border-radius: 6px;
  border: 1px solid #ffc000;
  flex: 1;
  margin-left: 14px;
  padding: 16px 16px 24px 16px;
`;

const Heading = styled.Text`
  color: #ffc000;
  font-size: 16px;
  font-weight: bold;
  line-height: 20px;
`;

const SubheadingContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin-bottom: 14px;
`;

const Divider = styled.View`
  background-color: black;
  border-radius: 1px;
  height: 3px;
  margin: 0 12px;
  width: 3px;
`;

const BodyText = styled.Text`
  color: #757677;
  font-size: 14px;
  line-height: 20px;
`;

const SubheadingText = styled(BodyText)`
  color: black;
  font-size: 14px;
  font-weight: bold;
  line-height: 20px;
`;
