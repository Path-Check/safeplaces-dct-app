import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { ExposureDatum, ExposureHistory } from '../../exposureHistory';
import { Typography } from '../../components/Typography';
import ExposureDatumDetail from './ExposureDatumDetail';
import { DateTimeUtils } from '../../helpers';
import Calendar from './Calendar';
import { Screens } from '../../navigation';
import { isGPS } from '../../COVIDSafePathsConfig';

import { Icons } from '../../assets';
import {
  Buttons,
  Spacing,
  Typography as TypographyStyles,
  Colors,
} from '../../styles';
import dayjs from 'dayjs';

interface HistoryProps {
  exposureHistory: ExposureHistory;
}

const History = ({ exposureHistory }: HistoryProps): JSX.Element => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [selectedDatum, setSelectedDatum] = useState<ExposureDatum | null>(
    null,
  );

  const isTodayOrBefore = (date: number) => {
    return !dayjs(date).isAfter(dayjs(), 'day');
  };

  const handleOnSelectDate = (datum: ExposureDatum) => {
    if (isTodayOrBefore(datum.date)) {
      setSelectedDatum(datum);
    }
  };

  const handleOnPressMoreInfo = () => {
    navigation.navigate(Screens.MoreInfo);
  };

  const titleText = t('screen_titles.exposure_history');
  const lastDaysText = t('exposure_history.last_days');

  const showExposureDetail =
    selectedDatum && !DateTimeUtils.isInFuture(selectedDatum.date);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container} alwaysBounceVertical={false}>
        <View>
          <View style={styles.headerRow}>
            <View style={{ flexShrink: 1 }}>
              <Typography style={styles.headerText}>{titleText}</Typography>
            </View>
            <TouchableOpacity
              onPress={handleOnPressMoreInfo}
              style={styles.moreInfoButton}>
              <SvgXml
                xml={Icons.QuestionMark}
                style={styles.moreInfoButtonIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.headerRow}>
            {!isGPS ? (
              <Typography style={styles.subHeaderText}>
                {lastDaysText}
              </Typography>
            ) : null}
          </View>
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
    backgroundColor: Colors.primaryBackground,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: Spacing.xSmall,
  },
  headerText: {
    ...TypographyStyles.header2,
    marginRight: Spacing.medium,
  },
  subHeaderText: {
    ...TypographyStyles.header4,
    ...TypographyStyles.bold,
  },
  moreInfoButton: {
    ...Buttons.tinyTeritiaryRounded,
    minHeight: Spacing.xHuge,
    minWidth: Spacing.xHuge,
  },
  moreInfoButtonIcon: {
    minHeight: Spacing.small,
    minWidth: Spacing.small,
  },
  calendarContainer: {
    marginTop: Spacing.xxLarge,
  },
  detailsContainer: {
    flex: 1,
    marginTop: Spacing.small,
    marginBottom: Spacing.huge,
  },
});

export default History;
