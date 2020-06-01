import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

import { Images } from '../assets';
import { Typography } from './Typography';

export const Checkbox = ({ label, onPress, checked }) => {
  return (
    <TouchableOpacity
      style={{ flexDirection: 'row' }}
      onPress={onPress}
      accessible
      accessibilityLabel={label}>
      <Image
        source={checked ? Images.BoxCheckedIcon : Images.BoxUncheckedIcon}
        style={{ width: 25, height: 25, marginRight: 10 }}
      />
      <Typography use='body1'>{label}</Typography>
    </TouchableOpacity>
  );
};
