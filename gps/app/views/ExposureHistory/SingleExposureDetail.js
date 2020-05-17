import styled from '@emotion/native';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';

import languages from '../../locales/languages';
import { CalendarDay } from './CalendarDay';

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(localizedFormat);

const MINUTE_IN_MS = 60 * 1000;

/**
 * Details for a single day exposure.
 *
 * @param {!import('../../constants/history').HistoryDay} props
 */
export const SingleExposureDetail = ({ date, exposureMinutes }) => {
  const exposureTimeHumanized = dayjs
    .duration(exposureMinutes * MINUTE_IN_MS)
    .humanize();

  // TODO: display today, yesterday, calendar() does not quite cut it.
  const dateHumanized = date.format('ll');

  return (
    <Container>
      <CalendarDay
        showMonthLabel
        date={date}
        exposureMinutes={exposureMinutes}
      />
      <DetailsBox>
        <Heading>{languages.t('history.possible_exposure')}</Heading>
        <SubheadingContainer>
          <SubheadingText>{exposureTimeHumanized}</SubheadingText>
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
  border: 1px solid ${({ theme }) => theme.warning};
  flex: 1;
  margin-left: 14px;
  padding: 16px 16px 24px 16px;
`;

const Heading = styled.Text`
  color: ${({ theme }) => theme.warning};
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
  background-color: ${({ theme }) => theme.textPrimaryOnBackground};
  border-radius: 1px;
  height: 3px;
  margin: 0 12px;
  width: 3px;
`;

const BodyText = styled.Text`
  color: ${({ theme }) => theme.textSecondaryOnBackground};
  font-size: 14px;
  line-height: 20px;
`;

const SubheadingText = styled(BodyText)`
  color: ${({ theme }) => theme.textPrimaryOnBackground};
  font-size: 14px;
  font-weight: bold;
  line-height: 20px;
`;
