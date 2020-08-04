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
  Iconography,
  Spacing,
} from '../../styles';

interface ExposureDatumIndicatorProps {
  exposureDatum: ExposureDatum;
  isSelected: boolean;
  disabled?: boolean;
}

type IndicatorStyle = [ViewStyle, TextStyle];

const ExposureDatumIndicator = ({
  exposureDatum,
  isSelected,
  disabled,
}: ExposureDatumIndicatorProps): JSX.Element => {
  const isToday = DateTimeUtils.isToday(exposureDatum.date);

  const applyBadge = (indicator: JSX.Element) => {
    return (
      <>
        {indicator}
        <View style={styles.todayBadge} />
      </>
    );
  };

  const applyRiskStyle = ([
    circleStyle,
    textStyle,
  ]: IndicatorStyle): IndicatorStyle => {
    switch (exposureDatum.kind) {
      case 'NoData': {
        return [
          { ...circleStyle },
          { ...textStyle, color: Colors.secondaryViolet },
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
            ...Iconography.possibleExposure,
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

  const indicator = (
    <Text style={[textStyle, disabled && { color: Colors.quaternaryViolet }]}>
      {dayNumber}
    </Text>
  );

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
    fontWeight: Typography.heavyWeight,
  },
  todayBadge: {
    ...Affordances.bottomDotBadge(Colors.primaryBlue),
  },
});

export default ExposureDatumIndicator;
