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

import {
  ExposureDatum,
  Possible,
  Unknown,
  NoKnown,
} from '../../ExposureNotificationContext';

interface ExposureDatumDetailsProps {
  exposureDatum: ExposureDatum;
}

const ExposureDatumDetail = ({
  exposureDatum,
}: ExposureDatumDetailsProps): JSX.Element => {
  switch (exposureDatum.kind) {
    case 'Possible': {
      return <PossibleExposureDetail datum={exposureDatum} />;
    }
    case 'Unknown': {
      return <UnknownExposureDetail datum={exposureDatum} />;
    }
    case 'NoKnown': {
      return <NoKnownExposureDetail datum={exposureDatum} />;
    }
  }
};

interface PossibleExposureDetailProps {
  datum: Possible;
}

const PossibleExposureDetail = ({
  datum: { date, possibleExposureTimeInMin, currentDailyReports },
}: PossibleExposureDetailProps) => {
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

interface NoKnownExposureDetailProps {
  datum: NoKnown;
}

const NoKnownExposureDetail = ({
  datum: { date },
}: NoKnownExposureDetailProps) => {
  const exposureDate = dayjs(date).format('dddd, MMM DD');
  const dailyReports = `Current daily reports: 0`;
  const explainationContent =
    'Your exposure history will be updated if this changes in the future.';
  return (
    <View style={styles.container}>
      <Typography style={styles.date}>{exposureDate}</Typography>
      <Typography sytle={styles.info}>{dailyReports}</Typography>
      <View style={styles.contentContainer}>
        <Typography style={styles.content}>{explainationContent}</Typography>
      </View>
    </View>
  );
};

interface UnknownExposureDetailProps {
  datum: Unknown;
}

const UnknownExposureDetail = ({
  datum: { date },
}: UnknownExposureDetailProps) => {
  const exposureDate = dayjs(date).format('dddd, MMM DD');
  const subTitleText = 'Exposure notifications disabled';
  const explainationContent =
    'You did not have exposure notifications enabled on this day.';
  return (
    <View style={styles.container}>
      <Typography style={styles.date}>{exposureDate}</Typography>
      <Typography sytle={styles.info}>{subTitleText}</Typography>
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

export default ExposureDatumDetail;
