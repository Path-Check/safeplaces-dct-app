import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import {
  ExposureDatum,
  Possible,
  NoKnown,
  NoData,
} from '../../exposureHistory';
import { Typography } from '../../components/Typography';
import { TimeHelpers } from '../utils';

import {
  Typography as TypographyStyles,
  Outlines,
  Colors,
  Spacing,
} from '../../styles';

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
    case 'NoKnown': {
      return <NoKnownExposureDetail datum={exposureDatum} />;
    }
    case 'NoData': {
      return <NoDataExposureDetail datum={exposureDatum} />;
    }
  }
};

interface PossibleExposureDetailProps {
  datum: Possible;
}

const PossibleExposureDetail = ({
  datum: { date, duration },
}: PossibleExposureDetailProps) => {
  const exposureDurationText = TimeHelpers.durationToString(duration);
  const { t } = useTranslation();
  const exposureDate = dayjs(date).format('dddd, MMM DD');
  const exposureTime = t('exposure_datum.possible.duration', {
    duration: exposureDurationText,
  });
  const explanationContent = t('exposure_datum.possible.explanation.gps', {
    duration: exposureDurationText,
  });

  return (
    <View style={styles.container}>
      <Typography style={styles.date}>{exposureDate}</Typography>
      <Typography style={styles.info}>{exposureTime}</Typography>
      <View style={styles.contentContainer}>
        <Typography style={styles.content}>{explanationContent}</Typography>
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
  const { t } = useTranslation();
  const exposureDate = dayjs(date).format('dddd, MMM DD');
  const explanationContent = t('exposure_datum.no_known.explanation');
  const explanationTitle = t('exposure_datum.no_known.title');
  return (
    <View style={styles.container}>
      <Typography style={styles.date}>{exposureDate}</Typography>
      <View style={styles.contentContainer}>
        <Typography style={styles.info}>{explanationTitle}</Typography>
        <Typography style={styles.content}>{explanationContent}</Typography>
      </View>
    </View>
  );
};

interface NoDataExposureDetailProps {
  datum: NoData;
}

const NoDataExposureDetail = ({
  datum: { date },
}: NoDataExposureDetailProps) => {
  const { t } = useTranslation();
  const exposureDate = dayjs(date).format('dddd, MMM DD');
  const explanationContent = t('exposure_datum.no_data.explanation');
  const explanationTitle = t('exposure_datum.no_data.title');
  return (
    <View style={styles.container}>
      <Typography style={styles.date}>{exposureDate}</Typography>
      <View style={styles.contentContainer}>
        <Typography style={styles.info}>{explanationTitle}</Typography>
        <Typography style={styles.content}>{explanationContent}</Typography>
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
    ...TypographyStyles.header6,
  },
  info: {
    ...TypographyStyles.mainContentViolet,
    paddingBottom: Spacing.xxSmall,
  },
  contentContainer: {
    paddingTop: Spacing.xxSmall,
  },
  content: {
    ...TypographyStyles.secondaryContent,
  },
});

export default ExposureDatumDetail;
