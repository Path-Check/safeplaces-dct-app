import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Typography } from '../../components/Typography';
import Colors from '../../constants/colors';
import { Colors as AssessmentColors } from './constants';

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
    ? Colors.GRAY_BUTTON
    : AssessmentColors.CTA);
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

        <Typography use='body1' style={styles.ctaText}>
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
    color: Colors.WHITE,
    textAlign: 'center',
  },
});
