import React, { useState, useEffect } from 'react';
import { BackHandler, ScrollView } from 'react-native';
import { css } from '@emotion/native';
import dayjs from 'dayjs';

import languages from './../locales/languages';
import { GetStoreData } from '../helpers/General';
import ButtonWrapper from '../components/ButtonWrapper';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import { CROSSED_PATHS } from '../constants/storage';
import { MAX_EXPOSURE_WINDOW, BIN_DURATION } from '../constants/history';
import { DetailedHistory } from './ExposureHistory/DetailedHistory';
import { Typography } from '../components/Typography';
import { Theme } from '../constants/themes';

export const ExposureHistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      let dayBins = await GetStoreData(CROSSED_PATHS);
      setIsLoading(false);

      // dayBins = generateFakeIntersections(6); // handy for creating faux data

      if (dayBins === null) {
        setHistory(null);
        console.log("Can't find Crossed Paths");
      } else {
        console.log('Found Crossed Paths');
        setHistory(convertToDailyMinutesExposed(dayBins));
      }
    }

    fetchData();

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // teardown code
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
    return true;
  };

  return (
    <Theme use='monochrome'>
      <NavigationBarWrapper
        title={languages.t('label.event_history_title')}
        onBackPress={() => navigation.goBack()}>
        <ScrollView
          contentContainerStyle={css`
            padding: 20px;
            background-color: white;
          `}>
          <Typography use='headline3'>
            {languages.t('history.timeline')}
          </Typography>
          {history && history.length ? (
            <DetailedHistory history={history} />
          ) : isLoading ? (
            <Typography use='body2'>
              {languages.t('label.loading_public_data')}
            </Typography>
          ) : (
            <>
              <Typography use='body1'>
                {languages.t('label.notification_data_not_available')}
              </Typography>
              <Typography use='body1'>
                {languages.t('label.notification_warning_text')}
              </Typography>
              <ButtonWrapper
                onPress={() => navigation.navigate('ChooseProviderScreen', {})}
                title={languages.t('label.notification_select_authority')}
              />
            </>
          )}
        </ScrollView>
      </NavigationBarWrapper>
    </Theme>
  );
};

// eslint-disable-next-line no-unused-vars
function generateFakeIntersections(days = MAX_EXPOSURE_WINDOW, maxBins = 50) {
  let pseudoBin = [];
  for (let i = 0; i < days; i++) {
    // Random Integer between 0-99
    const intersections = Math.max(
      Math.floor(Math.random() * maxBins - maxBins / 2),
      0,
    );
    pseudoBin.push(intersections);
  }
  return JSON.stringify(pseudoBin);
}

/**
 * Convert the daily "bins" payload to an array of daily minutes of exposure.
 *
 * e.g.
 *
 * ```js
 * "[1,2,3]"  // bins exposed
 * [{date: Date, exposureMinutes: 5}, ...]  // minutes exposed
 * ```
 *
 * @param {string} dayBin JSON stringified array of numbers e.g. `"[1,2,3]"`
 * @returns {import('../constants/history').History | null} Array of exposed minutes per day starting at today
 */
export function convertToDailyMinutesExposed(dayBin) {
  let dayBinParsed = JSON.parse(dayBin);

  if (!dayBinParsed) {
    return null;
  }

  const today = dayjs();

  const dailyMinutesExposed = dayBinParsed
    .slice(0, MAX_EXPOSURE_WINDOW) // last two weeks of crossing data only
    .map((binCount, i) => {
      return {
        date: today.startOf('day').subtract(i, 'day'),
        exposureMinutes: binCount * BIN_DURATION,
      };
    });
  return dailyMinutesExposed;
}
