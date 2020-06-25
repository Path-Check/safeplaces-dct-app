import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';

import { Images } from '../assets';
import { Typography } from './Typography';

import { Forms } from '../styles';

export const Checkbox = ({ label, onPress, checked }) => {
  return (
    <TouchableOpacity
      style={styles.checkbox}
      onPress={onPress}
      accessible
      accessibilityRole='checkbox'
      accessibilityLabel={label}>
      <Image
        source={checked ? Images.BoxCheckedIcon : Images.BoxUncheckedIcon}
        style={styles.checkboxIcon}
      />
      <Typography style={styles.checkboxText}>{label}</Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    ...Forms.checkbox,
  },
  checkboxIcon: {
    ...Forms.checkboxIcon,
  },
  checkboxText: {
    ...Forms.checkboxText,
  },
});
