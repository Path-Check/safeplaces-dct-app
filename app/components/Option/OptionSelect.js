import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { Typography } from '../../components/Typography';

import {
  SCREEN_TYPE_CHECKBOX,
  SCREEN_TYPE_DATE,
  SCREEN_TYPE_RADIO,
} from '../../views/assessment/constants';

import { Colors, Spacing, Typography as TypographyStyles } from '../../styles';

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
              height={Spacing.medium * 0.5}
              style={styles.indicatorIcon}
              width={Spacing.medium * 0.5}
              xml={icon}
            />
          )}
          {isSelected &&
            (inputType === SCREEN_TYPE_RADIO || inputType === SCREEN_TYPE_DATE)}
        </View>
      )}
      <Typography style={styles.title} testID='label'>
        {title}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  indicator: {
    alignItems: 'center',
    borderColor: Colors.primaryViolet,
    borderRadius: Spacing.medium * 2,
    borderWidth: 2,
    height: Spacing.large,
    justifyContent: 'center',
    marginTop: Spacing.tiny,
    marginRight: Spacing.large,
    width: Spacing.large,
  },
  indicatorSelected: {
    backgroundColor: Colors.secondaryBlue,
    borderColor: Colors.secondaryBlue,
  },
  title: {
    flex: 1,
    flexWrap: 'wrap',
    ...TypographyStyles.inputLabel
  },
});
