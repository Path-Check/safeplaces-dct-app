import React from 'react';
import { View, Text, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import dayjs from 'dayjs';

import { DateTimeUtils } from '../../helpers';
import { ExposureDatum } from '../../exposureHistory';
import {
  Affordances,
  Outlines,
  Colors,
  Typography,
  Spacing,
} from '../../styles';

interface ExposureDatumIndicatorProps {
  exposureDatum: ExposureDatum;
  isSelected: boolean;
}

type IndicatorStyle = [ViewStyle, TextStyle];

const ExposureDatumIndicator = ({
  exposureDatum,
  isSelected,
}: ExposureDatumIndicatorProps): JSX.Element => {
  const isToday = DateTimeUtils.isToday(exposureDatum.date);

  const applyBadge = (indicator: JSX.Element) => {
    return (
      <>
        {indicator}
        <View style={styles.selectedBadge} />
      </>
    );
  };

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
    if (isToday) {
      return [
        {
          ...circleStyle,
        },
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

  const indicator = <Text style={textStyle}>{dayNumber}</Text>;

  return (
    <View style={circleStyle}>
      {isToday ? applyBadge(indicator) : indicator}
    </View>
  );
};

const styles = StyleSheet.create({
  circleBase: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: Spacing.xHuge,
    height: Spacing.xHuge,
    borderRadius: Outlines.maxBorderRadius,
    borderColor: Colors.transparent,
    borderWidth: Outlines.extraThick,
  },
  textBase: {
    ...Typography.smallFont,
    ...Typography.monospace,
    color: Colors.primaryText,
    fontWeight: Typography.heavyWeight,
  },
  selectedBadge: {
    ...Affordances.bottomDotBadge(Colors.primaryText),
  },
});

export default ExposureDatumIndicator;
