import React from 'react';
import { Switch as RNSwitch } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Colors from '../constants/colors';

export const Switch = ({
  onValueChange,
  value = false,
  trackColor = { false: Colors.GRAY_BACKGROUND, true: Colors.SUCCESS },
  testID = 'switch',
  thumbColor = Colors.WHITE,
}) => {
  return (
    <TouchableOpacity testID={testID}>
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        trackColor={trackColor}
        thumbColor={thumbColor}
      />
    </TouchableOpacity>
  );
};
