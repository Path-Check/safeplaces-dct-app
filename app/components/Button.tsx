import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';

import { Typography } from './Typography';

import { Buttons, Typography as TypographyStyles } from '../styles';

interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  invert?: boolean;
}

export const Button = ({
  label,
  onPress,
  disabled,
  loading,
  style,
  textStyle,
  invert,
}: ButtonProps): JSX.Element => {
  const styles = invert ? darkStyle : lightStyle;
  const buttonTextStyle =
    disabled || loading
      ? { ...styles.textDisabled, ...textStyle }
      : { ...styles.textEnabled, ...textStyle };

  return (
    <TouchableOpacity
      onPress={onPress}
      accessible
      accessibilityLabel={label}
      accessibilityRole='button'
      disabled={disabled || loading}
      style={[styles.button, style]}>
      <Typography style={buttonTextStyle}>{loading ? ' ' : label}</Typography>
      {loading && (
        <ActivityIndicator
          size={'large'}
          style={{ position: 'absolute' }}
          color={buttonTextStyle.color}
        />
      )}
    </TouchableOpacity>
  );
};

/* eslint-disable react-native/no-unused-styles */
const lightStyle = StyleSheet.create({
  button: {
    ...Buttons.largeWhite,
  },
  textEnabled: {
    ...TypographyStyles.buttonTextDark,
  },
  textDisabled: {
    ...TypographyStyles.buttonTextDark,
    opacity: 0.5,
  },
});

const darkStyle = StyleSheet.create({
  button: {
    ...Buttons.largeBlue,
  },
  textEnabled: {
    ...TypographyStyles.buttonTextLight,
  },
  textDisabled: {
    ...TypographyStyles.buttonTextLight,
    opacity: 0.5,
  },
});
