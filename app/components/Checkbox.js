import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

import boxCheckedIcon from './../assets/images/boxCheckedIcon.png';
import boxUncheckedIcon from './../assets/images/boxUncheckedIcon.png';
import { Typography } from './Typography';

export const Checkbox = ({ label, onPress, checked }) => {
  return (
    <TouchableOpacity
      style={{ flexDirection: 'row' }}
      onPress={onPress}
      accessible
      accessibilityLabel={label}>
      <Image
        source={checked === true ? boxCheckedIcon : boxUncheckedIcon}
        style={{ width: 25, height: 25, marginRight: 10 }}
      />
      <Typography use='body1'>{label}</Typography>
    </TouchableOpacity>
  );
};
