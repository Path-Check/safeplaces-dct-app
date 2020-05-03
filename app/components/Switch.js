import React from 'react';
import { Switch as RNSwitch } from 'react-native';

import Colors from '../constants/colors';

export const Switch = ({ onValueChange, value = false, trackColor }) => {
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      trackColor={
        trackColor || { false: Colors.GRAY_BACKGROUND, true: Colors.SUCCESS }
      }
      thumbColor={Colors.WHITE}
      testID={'switch'}
    />
  );
};
