import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';

import {
  ExposureDatum,
  Possible,
  Unknown,
  NoKnown,
} from '../../ExposureHistoryContext';
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
  const exposureDurationText = TimeHelpers.durationMsToString(
    possibleExposureTimeInMin * 60 * 1000,
  );
  const navigation = useNavigation();
  const exposureDate = dayjs(date).format('dddd, MMM DD');
  const exposureTime = `Possible Exposure Time: ${exposureDurationText}`;
  const dailyReports = `Current daily reports: ${currentDailyReports}`;
  const explainationContent = `For ${exposureDurationText}, your phone was within 10 feet of someone who later received a confirmed positive COVID-19 diagnosis.`;

  const handleOnPressNextSteps = () => {
    navigation.navigate(Screens.NextSteps);
  };

  const nextStepsButtonText = 'What should I do next?';

  return (
    <>
      <View style={styles.container}>
        <Typography style={styles.date}>{exposureDate}</Typography>
        <Typography style={styles.info}>{exposureTime}</Typography>
        <Typography style={styles.info}>{dailyReports}</Typography>
        <View style={styles.contentContainer}>
          <Typography style={styles.content}>{explainationContent}</Typography>
        </View>
      </View>
      <View style={styles.ctaContainer}>
        <TouchableOpacity
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
  const exposureDate = dayjs(date).format('dddd, MMM DD');
  const dailyReports = `Current daily reports: 0`;
  const explainationContent =
    'Your exposure history will be updated if this changes in the future.';
  return (
    <View style={styles.container}>
      <Typography style={styles.date}>{exposureDate}</Typography>
      <Typography style={styles.info}>{dailyReports}</Typography>
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
      <Typography style={styles.info}>{subTitleText}</Typography>
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
    ...TypographyStyles.header2,
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
  ctaContainer: {
    marginBottom: Spacing.medium,
  },
  nextStepsButton: {
    ...Buttons.largeBlueOutline,
    marginTop: Spacing.xLarge,
  },
  nextStepsButtonText: {
    ...TypographyStyles.ctaButtonOutlined,
  },
});

export default ExposureDatumDetail;
