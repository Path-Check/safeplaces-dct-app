import React from 'react';
import { ScrollView } from 'react-native';

import styled, { css } from '@emotion/native';

import languages from '../../locales/languages';
import Colors from '../../constants/colors';

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
      <ScrollView
        contentContainerStyle={css`
          padding: 20px 0;
        `}>
        <ExposureCalendarView history={history} />

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

        <Heading>What does this mean?</Heading>
        <BodyTex>
          Based on your GPS history, it is possible that you may have been in
          contact with or close to somebody who was diagnosed with COVID19. This
          does not mean you are infected but that you might be.
        </BodyTex>
        <BodyTex>
          For further information on what you should do you can refer to the
          Mayo Clinic’s website.
        </BodyTex>
        <Heading>What if I’m not showing symptoms?</Heading>
        <BodyTex>
          If you have no symptoms but still would like to be tested you can go
          to your nearest testing site. Link to local PH.
        </BodyTex>
        <BodyTex>
          Individuals who don&apos;t exhibit symptoms can sometimes still carry
          the infection and infect others. Being careful about social distancing
          and coming in contact with large groups or at risk individuals (the
          elderly, those with significant other medical issues) is important to
          manage both your risk and the risk to others.
        </BodyTex>
      </ScrollView>
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
  backgroundcolor: ${Colors.DIVIDER};
  height: 1px;
  width: 100%;
`;

const NoExposure = styled.Text`
  margin: 0 30px;
  color: forestgreen;
  font-size: 20px;
  text-align: center;
  font-family: 'IBM Plex Sans';
`;
