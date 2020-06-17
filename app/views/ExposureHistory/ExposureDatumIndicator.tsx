import React from 'react';
import { View, Text, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import dayjs from 'dayjs';

import { DateTimeUtils } from '../../helpers';
import { ExposureDatum } from '../../exposureHistory';
import { Outlines, Colors, Typography } from '../../styles';

interface ExposureDatumIndicatorProps {
  exposureDatum: ExposureDatum;
  isSelected: boolean;
}

type IndicatorStyle = [ViewStyle, TextStyle];

const ExposureDatumIndicator = ({
  exposureDatum,
  isSelected,
}: ExposureDatumIndicatorProps): JSX.Element => {
  const applyRiskStyle = ([
    circleStyle,
    textStyle,
  ]: IndicatorStyle): IndicatorStyle => {
    switch (exposureDatum.kind) {
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
    if (DateTimeUtils.isToday(exposureDatum.date)) {
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

  const baseStyles: IndicatorStyle = [styles.circleBase, styles.textBase];

  const [circleStyle, textStyle] = [baseStyles]
    .map(applyIsTodayStyle)
    .map(applyRiskStyle)
    .flatMap(applyIsSelectedStyle);

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
    borderRadius: Outlines.maxBorderRadius,
    borderColor: Colors.transparent,
    borderWidth: Outlines.thick,
  },
  textBase: {
    ...Typography.label,
  },
});

export default ExposureDatumIndicator;
