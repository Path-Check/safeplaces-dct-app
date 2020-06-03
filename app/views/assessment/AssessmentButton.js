import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Typography } from '../../components/Typography';
import Colors from '../../constants/colors';

/**
 * @typedef { import("react").ReactNode } ReactNode
 */

/** @type {React.FunctionComponent<{
 *   color?: string;
 *   onPress: () => void;
 *   title: string;
 *   disabled: boolean;
 * }>} */
const AssessmentButton = ({ color, onPress, title, disabled = false }) => {
  let backgroundColor = color
    ? color
    : (disabled
    ? Colors.SECONDARY_50
    : Colors.PRIMARY_50);
  let textColor = color
    ? color
    : (disabled
    ? Colors.SECONDARY_100
    : Colors.WHITE);
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

        <Typography use='body1' style={[styles.ctaText, { color: textColor,},]}>
          {title}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

export default AssessmentButton;

const styles = StyleSheet.create({
  cta: {
    borderRadius: 10,
    paddingVertical: 22,
    paddingHorizontal: 14,
  },
  ctaText: {
    color: Colors.SECONDARY_10,
    textAlign: 'center',
  },
});
