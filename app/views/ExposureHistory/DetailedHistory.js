import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';

import { Typography } from '../../components';
import languages from '../../locales/languages';
import { useAssets } from '../../TracingStrategyAssets';
import { ExposureCalendarView } from './ExposureCalendarView';
import { SingleExposureDetail } from './SingleExposureDetail';
import { isGPS } from '../../TracingStrategyAssets';
import ExposureNotificationContext from '../../ExposureNotificationContext';
import HasBeenExposedDetail from './HasBeenExposedDetail';

import { Spacing } from '../../styles';

/**
 * Detailed info when there is some exposure found
 *
 * @param {{history: !import('../../constants/history').History}} param0
 */
export const DetailedHistory = ({ history }) => {
  const { detailedHistoryPageWhatThisMeansPara } = useAssets();
  const { hasBeenExposed } = useContext(ExposureNotificationContext);
  const exposedDays = history.filter((day) => day.exposureMinutes > 0);

  const Divider = () => {
    return <View style={styles.divider} />;
  };

  const gpsExposureInfo = () => {
    return (
      <>
        {exposedDays.map(({ exposureMinutes, date }) => (
          <SingleExposureDetail
            key={date.format()}
            date={date}
            exposureMinutes={exposureMinutes}
          />
        ))}

        {exposedDays.length === 0 ? (
          <>
            <Typography use='headline3'>
              {languages.t('label.home_no_contact_header')}
            </Typography>
            <Typography use='body3'>
              {languages.t('label.home_no_contact_subtext')}
            </Typography>
            <Divider />
          </>
        ) : (
          <>
            <Typography use='headline3'>
              {languages.t('history.what_does_this_mean')}
            </Typography>
            <Typography use='body3'>
              {detailedHistoryPageWhatThisMeansPara}
            </Typography>
          </>
        )}

        <Divider />

        {exposedDays.length ? (
          <>
            <Typography use='headline3'>
              {languages.t('history.what_if_no_symptoms')}
            </Typography>
            <Typography use='body3'>
              {languages.t('history.what_if_no_symptoms_para')}
            </Typography>
          </>
        ) : null}
      </>
    );
  };

  const bteExposureInfo = (hasBeenExposed) => {
    const exposure = {
      date: Date.now(),
      possibleExposureTimeInMin: 45,
      currentDailyReports: 1,
    };

    return (
      <>
        {hasBeenExposed ? (
          <View style={styles.detailsContainer}>
            <HasBeenExposedDetail exposure={exposure} />
          </View>
        ) : null}
      </>
    );
  };

  return (
    <>
      <ExposureCalendarView weeks={3} history={history} />
      <Divider />
      {isGPS ? gpsExposureInfo() : bteExposureInfo(hasBeenExposed)}
    </>
  );
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    height: Spacing.large,
  },
  detailsContainer: {
    flex: 1,
  },
});
