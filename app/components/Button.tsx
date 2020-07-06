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
  testID?: string;
  textStyle?: TextStyle;
}

export const Button = ({
  label,
  onPress,
  disabled,
  loading,
  style,
  testID,
  textStyle,
}: ButtonProps): JSX.Element => {
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
      style={[styles.button, style]}
      testID={testID}>
      {loading ? (
        <ActivityIndicator size={'large'} />
      ) : (
        <Typography style={buttonTextStyle}>{label}</Typography>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    ...Buttons.largeWhite,
  },
  textEnabled: {
    ...TypographyStyles.buttonTextDark,
  },
  textDisabled: {
    ...TypographyStyles.buttonTextDark,
  },
});
