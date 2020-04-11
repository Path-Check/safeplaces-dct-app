import React from 'react';

import styled from '@emotion/native';

import languages from '../../locales/languages';

import { ExposureCalendarView } from './ExposureCalendarView';
import { SingleExposureDetail } from './SingleExposureDetail';

/**
 * Detailed info when there is some exposure found
 *
 * @param {{history: !import('../constants/history').History}} param0
 */
export const DetailedHistory = ({ history }) => {
  const exposedDays = history.filter(day => day.exposureTime > 0);
  return (
    <>
      <ExposureCalendarView weeks={3} history={history} />

      <Divider />

      {exposedDays.length === 0 && (
        <NoExposure>
          {languages.t('label.notifications_no_exposure')}
        </NoExposure>
      )}
      {exposedDays.map(({ exposureTime, daysAgo }) => (
        <SingleExposureDetail
          key={daysAgo}
          daysAgo={daysAgo}
          exposureTime={exposureTime}
        />
      ))}

      <Heading>{languages.t('history.what_does_this_mean')}</Heading>
      <BodyTex>{languages.t('history.what_does_this_mean_para')}</BodyTex>
      <Heading>{languages.t('history.what_if_no_symptoms')}</Heading>
      <BodyTex>{languages.t('history.what_if_no_symptoms_para')}</BodyTex>
    </>
  );
};

const Heading = styled.Text`
  font-family: 'IBM Plex Sans';
  font-weight: bold;
  font-size: 16px;
  line-height: 40px;
  padding-top: 20px;
  padding-bottom: 10px;
`;

const BodyTex = styled.Text`
  font-family: 'IBM Plex Sans';
  font-size: 15px;
  line-height: 22px;
  padding: 5px 0;
  color: #6d6d73;
`;

const Divider = styled.View`
  height: 20px;
  width: 100%;
`;

const NoExposure = styled.Text`
  margin: 0 30px;
  color: forestgreen;
  font-size: 20px;
  text-align: center;
  font-family: 'IBM Plex Sans';
`;
