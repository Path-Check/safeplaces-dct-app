import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
import { Screens } from '../../navigation';

import {
  Typography as TypographyStyles,
  Outlines,
  Colors,
  Buttons,
  Spacing,
} from '../../styles';
import { isGPS } from '../../COVIDSafePathsConfig';

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
  const navigation = useNavigation();
  const { t } = useTranslation();
  const exposureDate = dayjs(date).format('dddd, MMM DD');
  const exposureTime = t('exposure_datum.possible.duration', {
    duration: exposureDurationText,
  });
  const explanationContent = t(
    isGPS
      ? 'exposure_datum.possible.explanation.gps'
      : 'exposure_datum.possible.explanation.bt',
    {
      duration: exposureDurationText,
    },
  );
  const nextStepsButtonText = t('exposure_datum.possible.what_next');

  const handleOnPressNextSteps = () => {
    navigation.navigate(Screens.NextSteps);
  };

  return (
    <>
      <View style={styles.container}>
        <Typography style={styles.date}>{exposureDate}</Typography>
        <Typography style={styles.info}>{exposureTime}</Typography>
        <View style={styles.contentContainer}>
          <Typography style={styles.content}>{explanationContent}</Typography>
        </View>
        <TouchableOpacity
          testID={'exposure-history-next-steps-button'}
          style={styles.nextStepsButton}
          onPress={handleOnPressNextSteps}>
          <Typography style={styles.nextStepsButtonText}>
            {nextStepsButtonText}
          </Typography>
        </TouchableOpacity>
      </View>
    </>
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
  return (
    <View style={styles.container}>
      <Typography style={styles.date}>{exposureDate}</Typography>
      <View style={styles.contentContainer}>
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
  return (
    <View style={styles.container}>
      <Typography style={styles.date}>{exposureDate}</Typography>
      <View style={styles.contentContainer}>
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
    lineHeight: TypographyStyles.largeLineHeight,
  },
  contentContainer: {
    paddingTop: Spacing.xxSmall,
  },
  content: {
    ...TypographyStyles.secondaryContent,
  },
  nextStepsButton: {
    ...Buttons.largeBlue,
    marginTop: Spacing.xLarge,
  },
  nextStepsButtonText: {
    ...TypographyStyles.buttonTextLight,
  },
});

export default ExposureDatumDetail;
