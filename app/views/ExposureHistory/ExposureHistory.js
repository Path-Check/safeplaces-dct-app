import { css } from '@emotion/native';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import React, { useEffect, useState } from 'react';
import { BackHandler, ScrollView } from 'react-native';

import { NavigationBarWrapper, Typography } from '../../components';
import { MAX_EXPOSURE_WINDOW } from '../../constants/history';
import { CROSSED_PATHS } from '../../constants/storage';
import { defaultTheme } from '../../constants/themes';
import { GetStoreData } from '../../helpers/General';
import languages from '../../locales/languages';
import { DetailedHistory } from './DetailedHistory';
import { isGPS } from '../../TracingStrategyAssets';

const NO_HISTORY = [];

export const ExposureHistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (isGPS) {
        let dayBins = await GetStoreData(CROSSED_PATHS);

        if (dayBins === null) {
          setHistory(NO_HISTORY);
          console.log("Can't find Crossed Paths");
        } else {
          console.log('Found Crossed Paths');
          setHistory(convertToDailyMinutesExposed(dayBins));
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }

    fetchData();

    const handleBackPress = () => {
      navigation.goBack();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // teardown code
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigation]);

  const themeBackground = defaultTheme.background;

  const themeText = defaultTheme.textPrimaryOnBackground;

  return (
    <NavigationBarWrapper
      includeBackButton={false}
      title={languages.t('label.event_history_title')}
      onBackPress={() => navigation.goBack()}>
      <ScrollView
        contentContainerStyle={css`
          padding: 20px;
          background-color: ${themeBackground};
          color: ${themeText};
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
  );
};

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
 * @returns {import('../../constants/history').History} Array of exposed minutes per day starting at today
 */
export function convertToDailyMinutesExposed(dayBin) {
  dayjs.extend(duration);
  let dayBinParsed = JSON.parse(dayBin);

  if (!dayBinParsed) {
    return NO_HISTORY;
  }

  const today = dayjs();

  const dailyMinutesExposed = dayBinParsed
    .slice(0, MAX_EXPOSURE_WINDOW) // last two weeks of crossing data only
    .map((binExposureTime, i) => {
      return {
        date: today.startOf('day').subtract(i, 'day'),
        exposureMinutes: dayjs.duration(binExposureTime).asMinutes(),
      };
    });
  return dailyMinutesExposed;
}
