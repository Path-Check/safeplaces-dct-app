import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';

import { Typography } from '../../components';
import languages from '../../locales/languages';
import { useAssets } from '../../TracingStrategyAssets';
import { ExposureCalendarView } from './ExposureCalendarView';
import { SingleExposureDetail } from './SingleExposureDetail';
import { isGPS } from '../../COVIDSafePathsConfig';
import ExposureNotificationContext from '../../ExposureNotificationContext';
import ExposureDatumDetail from './ExposureDatumDetail';
import Calendar from './Calendar';

import { Spacing } from '../../styles';

/**
 * Detailed info when there is some exposure found
 *
 * @param {{history: !import('../../constants/history').History}} param0
 */
export const DetailedHistory = ({ history }) => {
  const {
    detailedHistoryPageWhatThisMeansPara,
    allServicesOnScreenHeader,
    allServicesOnScreenSubheader,
  } = useAssets();
  const { exposureHistory } = useContext(ExposureNotificationContext);
  const [selectedExposureDatum, setSelectedExposureDatum] = useState(
    exposureHistory[exposureHistory.length - 1],
  );

  const Divider = () => {
    return <View style={styles.divider} />;
  };

  const gpsExposureInfo = () => {
    const exposedDays = history.filter((day) => day.exposureMinutes > 0);
    return (
      <>
        <ExposureCalendarView
          weeks={3}
          history={history}
          onSelectDate={handleOnSelectDate}
        />
        <Divider />
        {exposedDays.map(({ exposureMinutes, date }) => (
          <SingleExposureDetail
            key={date.format()}
            date={date}
            exposureMinutes={exposureMinutes}
          />
        ))}

        {exposedDays.length === 0 ? (
          <>
            <Typography use='headline3'>{allServicesOnScreenHeader}</Typography>
            <Typography use='body3'>{allServicesOnScreenSubheader}</Typography>
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

  const handleOnSelectDate = (datum) => {
    setSelectedExposureDatum(datum);
  };

  return (
    <>
      {isGPS ? (
        gpsExposureInfo()
      ) : (
        <>
          <View styles={styles.calendarContainer}>
            <Calendar
              exposureHistory={exposureHistory}
              onSelectDate={handleOnSelectDate}
              selectedDatum={selectedExposureDatum}
            />
          </View>
          <View style={styles.detailsContainer}>
            <ExposureDatumDetail exposureDatum={selectedExposureDatum} />
          </View>
        </>
      )}
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
