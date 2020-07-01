import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Typography } from '../../components/Typography';

import { Colors } from '../../styles';

/**
 * @typedef { import("react").ReactNode } ReactNode
 */

/** @type {React.FunctionComponent<{
 *   color?: string;
 *   onPress: () => void;
 *   title: string;
 *   disabled: boolean;
 * }>} */
export const Button = ({ color, onPress, title, disabled = false }) => {
  let backgroundColor = color
    ? color
    : disabled
    ? Colors.secondaryBackground
    : Colors.secondaryBlue;
  let textColor = color
    ? color
    : disabled
    ? Colors.disabledButtonText
    : Colors.white;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      testID='assessment-button'>
      <View
        style={[
          styles.cta,
          {
            backgroundColor: backgroundColor,
          },
        ]}>
        <Typography use='body1' style={[styles.ctaText, { color: textColor }]}>
          {title}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cta: {
    borderRadius: 10,
    paddingVertical: 22,
    paddingHorizontal: 14,
  },
  ctaText: {
    color: Colors.faintGray,
    textAlign: 'center',
  },
});
