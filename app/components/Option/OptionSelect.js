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

const checkboxInput = SCREEN_TYPE_CHECKBOX

export function OptionSelect({
  wrapperStyle,
  isValidType,
  isSelected,
  inputType,
  icon,
  title,
}) {

  const indicatorStyle = (inputType === SCREEN_TYPE_CHECKBOX) ? styles.indicatorCheck : styles.indicatorRadio

  return (
    <View style={wrapperStyle}>
      {isValidType && (
        <View
          style={[indicatorStyle, isSelected && styles.indicatorSelected]}>
          {isSelected && inputType === SCREEN_TYPE_CHECKBOX && (
            <SvgXml
              width={Spacing.medium}
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

const inputStyle = StyleSheet.create({
  indicator: {
    alignItems: 'center',
    borderColor: Colors.radioBorder,
    borderWidth: 2,
    height: Spacing.large,
    justifyContent: 'center',
    marginTop: Spacing.tiny,
    marginRight: Spacing.large,
    width: Spacing.large,
  },
});

const styles = StyleSheet.create({
  indicatorRadio: {
    ...inputStyle.indicator,
    borderRadius: Spacing.medium * 2,
  },
  indicatorCheck: {
    ...inputStyle.indicator,
    borderWidth: 2,
    borderRadius: Spacing.tiny,
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
