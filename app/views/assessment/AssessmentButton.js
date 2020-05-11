import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
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
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View
        style={[
          styles.cta,
          {
            backgroundColor: backgroundColor,
          },
        ]}>
        <Text style={styles.ctaText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default AssessmentButton;

const styles = StyleSheet.create({
  cta: {
    borderRadius: 12,
    padding: 14,
  },
  ctaText: {
    color: Colors.WHITE,
    fontFamily: Fonts.primaryBold,
    fontSize: 18,
    textAlign: 'center',
  },
});
