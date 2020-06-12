import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import {
  Colors as AssessmentColors,
  SCREEN_TYPE_CHECKBOX,
  SCREEN_TYPE_DATE,
  SCREEN_TYPE_RADIO,
} from '../../views/assessment/constants';

const INDICATOR_WIDTH = 20;
const INDICATOR_MARGIN = 10;

export function OptionSelect({
  wrapperStyle,
  isValidType,
  isSelected,
  inputType,
  icon,
  title,
}) {
  return (
    <View style={wrapperStyle}>
      {isValidType && (
        <View
          style={[styles.indicator, isSelected && styles.indicatorSelected]}>
          {isSelected && inputType === SCREEN_TYPE_CHECKBOX && (
            <SvgXml
              height={INDICATOR_WIDTH * 0.5}
              style={styles.indicatorIcon}
              width={INDICATOR_WIDTH * 0.5}
              xml={icon}
            />
          )}
          {isSelected &&
            (inputType === SCREEN_TYPE_RADIO || inputType === SCREEN_TYPE_DATE)}
        </View>
      )}
      <Typography use='body1' style={styles.title} testID='label'>
        {title}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  indicator: {
    alignItems: 'center',
    borderColor: AssessmentColors.BORDER,
    borderRadius: INDICATOR_WIDTH * 2,
    borderWidth: 2,
    height: INDICATOR_WIDTH,
    justifyContent: 'center',
    marginRight: INDICATOR_MARGIN,
    width: INDICATOR_WIDTH,
  },
  indicatorSelected: {
    backgroundColor: Colors.PRIMARY_50,
    borderColor: Colors.PRIMARY_50,
  },
  title: {
    flex: 1,
    flexWrap: 'wrap',
    color: Colors.BLACK,
  },
});
