import React from 'react';
import { View, Text, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import dayjs from 'dayjs';

import { ExposureDatum } from '../../ExposureNotificationContext';
import { Outlines, Colors, Typography } from '../../styles';

interface ExposureDatumIndicatorProps {
  exposureDatum: ExposureDatum;
  isSelected: boolean;
}

type Posix = number;

type IndicatorStyle = [ViewStyle, TextStyle];

const isToday = (date: Posix): boolean => {
  const beginningOfDay = dayjs(Date.now()).startOf('day').valueOf();
  const endOfDay = dayjs(Date.now()).endOf('day').valueOf();
  return beginningOfDay <= date && endOfDay >= date;
};

const ExposureDatumIndicator = ({
  exposureDatum,
  isSelected,
}: ExposureDatumIndicatorProps): JSX.Element => {
  const applyRiskStyle = ([
    circleStyle,
    textStyle,
  ]: IndicatorStyle): IndicatorStyle => {
    switch (exposureDatum.kind) {
      case 'Unknown': {
        return [
          { ...circleStyle },
          { ...textStyle, color: Colors.tertiaryViolet },
        ];
      }
      case 'NoKnown': {
        return [
          { ...circleStyle },
          { ...textStyle, color: Colors.primaryViolet },
        ];
      }
      case 'Possible': {
        return [
          {
            ...circleStyle,
            backgroundColor: Colors.exposureRiskWarning,
            borderColor: Colors.exposureRiskWarning,
          },
          { ...textStyle, color: Colors.white },
        ];
      }
    }
  };

  const applyIsTodayStyle = ([
    circleStyle,
    textStyle,
  ]: IndicatorStyle): IndicatorStyle => {
    if (isToday(exposureDatum.date)) {
      return [
        circleStyle,

        {
          ...textStyle,
          fontWeight: Typography.heaviestWeight,
        },
      ];
    } else {
      return [circleStyle, textStyle];
    }
  };

  const applyIsSelectedStyle = ([
    circleStyle,
    textStyle,
  ]: IndicatorStyle): IndicatorStyle => {
    if (isSelected) {
      return [
        {
          ...circleStyle,
          borderColor: Colors.darkGray,
        },
        { ...textStyle },
      ];
    } else {
      return [circleStyle, textStyle];
    }
  };

  const [circleStyle, textStyle] = applyIsTodayStyle(
    applyIsSelectedStyle(applyRiskStyle([styles.circleBase, styles.textBase])),
  );

  const dayNumber = dayjs(exposureDatum.date).format('D');

  return (
    <View style={circleStyle}>
      <Text style={textStyle}>{dayNumber}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circleBase: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: Outlines.borderRadiusMax,
    borderColor: Colors.transparent,
    borderWidth: Outlines.thick,
  },
  textBase: {
    ...Typography.label,
  },
});

export default ExposureDatumIndicator;
