import { css } from '@emotion/native';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { BackHandler, ScrollView } from 'react-native';

import languages from './../locales/languages';
import ButtonWrapper from '../components/ButtonWrapper';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import { Typography } from '../components/Typography';
import { BIN_DURATION, MAX_EXPOSURE_WINDOW } from '../constants/history';
import { CROSSED_PATHS } from '../constants/storage';
import { Theme } from '../constants/themes';
import { GetStoreData } from '../helpers/General';
import { DetailedHistory } from './ExposureHistory/DetailedHistory';

const NO_HISTORY = [];

export const ExposureHistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      let dayBins = await GetStoreData(CROSSED_PATHS);
      setIsLoading(false);

      // dayBins = generateFakeIntersections(6); // handy for creating faux data

      if (dayBins === null) {
        setHistory(NO_HISTORY);
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
          {isLoading ? (
            <Typography use='body2'>
              {languages.t('label.loading_public_data')}
            </Typography>
          ) : (
            <DetailedHistory history={history} />
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
 * @returns {import('../constants/history').History} Array of exposed minutes per day starting at today
 */
export function convertToDailyMinutesExposed(dayBin) {
  let dayBinParsed = JSON.parse(dayBin);

  if (!dayBinParsed) {
    return NO_HISTORY;
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
