import React from 'react';
import { StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';

import { Typography } from '../../components/Typography';

import {
  Typography as TypographyStyles,
  Outlines,
  Colors,
  Spacing,
} from '../../styles';

type Posix = number;

interface Exposure {
  date: Posix;
  possibleExposureTimeInMin: number;
  currentDailyReports: number;
}

interface HasBeenExposedDetailProps {
  exposure: Exposure;
}

const HasBeenExposedDetail = ({
  exposure: { date, possibleExposureTimeInMin, currentDailyReports },
}: HasBeenExposedDetailProps): JSX.Element => {
  const exposureDate = dayjs(date).format('dddd, MMM DD');
  const exposureTime = `Possible Exposure Time: ${possibleExposureTimeInMin}`;
  const dailyReports = `Current daily reports: ${currentDailyReports}`;
  const explainationContent = `For ${possibleExposureTimeInMin} consecutive minutes, your phone was within 10 feet of someone who later received a confirmed positive COVID-19 diagnosis.`;

  return (
    <View style={styles.container}>
      <Typography style={styles.date}>{exposureDate}</Typography>
      <Typography style={styles.info}>{exposureTime}</Typography>
      <Typography sytle={styles.info}>{dailyReports}</Typography>
      <View style={styles.contentContainer}>
        <Typography style={styles.content}>{explainationContent}</Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Spacing.medium,
    ...Outlines.roundedBorder,
    borderColor: Colors.lighterGray,
  },
  date: {
    ...TypographyStyles.header1,
  },
  info: {
    lineHeight: TypographyStyles.largeLineHeight,
  },
  contentContainer: {
    paddingTop: Spacing.xxSmall,
  },
  content: {
    ...TypographyStyles.secondaryContent,
  },
});

export default HasBeenExposedDetail;
