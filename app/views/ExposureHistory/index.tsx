import React, { useState, useContext, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  BackHandler,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import ExposureHistoryContext from '../../ExposureHistoryContext';
import { ExposureDatum } from '../../exposureHistory';
import { Typography } from '../../components/Typography';
import ExposureDatumDetail from './ExposureDatumDetail';
import { DateTimeUtils } from '../../helpers';
import Calendar from './Calendar';
import { Screens, useStatusBarEffect } from '../../navigation';
import { isGPS } from '../../COVIDSafePathsConfig';

import { Icons } from '../../assets';
import { Buttons, Spacing, Typography as TypographyStyles } from '../../styles';

const ExposureHistoryScreen = (): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { exposureHistory } = useContext(ExposureHistoryContext);
  const [selectedDatum, setSelectedDatum] = useState<ExposureDatum | null>(
    null,
  );

  useStatusBarEffect('dark-content');

  useEffect(() => {
    const handleBackPress = () => {
      navigation.goBack();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigation]);

  const handleOnSelectDate = (datum: ExposureDatum) => {
    setSelectedDatum(datum);
  };

  const handleOnPressMoreInfo = () => {
    navigation.navigate(Screens.MoreInfo);
  };

  const titleText = t('screen_titles.exposure_history');
  const lastDaysText = t('exposure_history.last_days');

  const showExposureDetail =
    selectedDatum && !DateTimeUtils.isInFuture(selectedDatum.date);

  return (
    <SafeAreaView>
      <ScrollView
        style={styles.container}
        contentInset={{ top: 0, bottom: 140 }}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Typography style={styles.headerText}>{titleText}</Typography>
            {!isGPS ? (
              <TouchableOpacity
                onPress={handleOnPressMoreInfo}
                style={styles.moreInfoButton}>
                <SvgXml xml={Icons.IconQuestionMark} />
              </TouchableOpacity>
            ) : null}
          </View>
          {!isGPS ? (
            <View style={styles.headerRow}>
              <Typography style={styles.subHeaderText}>
                {lastDaysText}
              </Typography>
            </View>
          ) : null}
        </View>
        <View style={styles.calendarContainer}>
          <Calendar
            exposureHistory={exposureHistory}
            onSelectDate={handleOnSelectDate}
            selectedDatum={selectedDatum}
          />
        </View>
        <View style={styles.detailsContainer}>
          {selectedDatum && showExposureDetail ? (
            <ExposureDatumDetail exposureDatum={selectedDatum} />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.medium,
  },
  header: {},
  headerRow: {
    flexDirection: 'row',
    marginTop: Spacing.xSmall,
  },
  headerText: {
    ...TypographyStyles.header2,
    marginRight: Spacing.medium,
  },
  subHeaderText: {
    ...TypographyStyles.header4,
  },
  moreInfoButton: {
    ...Buttons.tinyTeritiaryRounded,
    minHeight: 44,
    minWidth: 44,
  },
  calendarContainer: {
    marginTop: Spacing.xxLarge,
  },
  detailsContainer: {
    flex: 1,
    marginTop: Spacing.small,
  },
});

export default ExposureHistoryScreen;
