import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
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
}

export const Button = ({
  label,
  onPress,
  disabled,
  loading,
  style,
}: ButtonProps): JSX.Element => {
  const textStyle =
    disabled || loading ? styles.textDisabled : styles.textEnabled;

  return (
    <TouchableOpacity
      onPress={onPress}
      accessible
      accessibilityLabel={label}
      accessibilityRole='button'
      disabled={disabled || loading}
      style={[styles.button, style]}>
      {loading ? (
        <ActivityIndicator size={'large'} />
      ) : (
        <Typography style={textStyle}>{label}</Typography>
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
