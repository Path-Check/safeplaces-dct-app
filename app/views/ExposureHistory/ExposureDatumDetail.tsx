import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';

import { ExposureDatum, Possible, NoKnown } from '../../exposureHistory';
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
    case 'NoKnown': {
      return <NoKnownExposureDetail datum={exposureDatum} />;
    }
  }
};

interface PossibleExposureDetailProps {
  datum: Possible;
}

const PossibleExposureDetail = ({
  datum: { date, duration },
}: PossibleExposureDetailProps) => {
  const exposureDurationText = TimeHelpers.durationMsToString(duration);
  const navigation = useNavigation();
  const exposureDate = dayjs(date).format('dddd, MMM DD');
  const exposureTime = `Possible Exposure Time: ${exposureDurationText}`;
  const explanationContent = `For ${exposureDurationText}, your phone was within 10 feet of someone who later received a confirmed positive COVID-19 diagnosis.`;

  const handleOnPressNextSteps = () => {
    navigation.navigate(Screens.NextSteps);
  };

  const nextStepsButtonText = 'What should I do next?';

  return (
    <>
      <View style={styles.container}>
        <Typography style={styles.date}>{exposureDate}</Typography>
        <Typography style={styles.info}>{exposureTime}</Typography>
        <View style={styles.contentContainer}>
          <Typography style={styles.content}>{explanationContent}</Typography>
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
  const explanationContent =
    'Your exposure history will be updated if this changes in the future.';
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
  ctaContainer: {
    marginBottom: Spacing.medium,
  },
  nextStepsButton: {
    ...Buttons.largeBlueOutline,
    marginTop: Spacing.xLarge,
  },
  nextStepsButtonText: {
    ...TypographyStyles.buttonTextDark,
  },
});

export default ExposureDatumDetail;
