import styled from '@emotion/native';
import React from 'react';

import { Typography } from '../../components/Typography';
import languages from '../../locales/languages';
import { ExposureCalendarView } from './ExposureCalendarView';
import { SingleExposureDetail } from './SingleExposureDetail';

/**
 * Detailed info when there is some exposure found
 *
 * @param {{history: !import('../constants/history').History}} param0
 */
export const DetailedHistory = ({ history }) => {
  const exposedDays = history.filter(day => day.exposureMinutes > 0);
  return (
    <>
      <ExposureCalendarView weeks={3} history={history} />

      <Divider />

      {exposedDays.map(({ exposureMinutes, date }) => (
        <SingleExposureDetail
          key={date.format()}
          date={date}
          exposureMinutes={exposureMinutes}
        />
      ))}

      <Typography use='headline3'>
        {languages.t('history.what_does_this_mean')}
      </Typography>
      <Typography use='body3'>
        {languages.t('history.what_does_this_mean_para')}
      </Typography>

      <Typography use='headline3'>
        {languages.t('history.what_if_no_symptoms')}
      </Typography>
      <Typography use='body3'>
        {languages.t('history.what_if_no_symptoms_para')}
      </Typography>
    </>
  );
};

const Divider = styled.View`
  height: 24px;
  width: 100%;
`;
