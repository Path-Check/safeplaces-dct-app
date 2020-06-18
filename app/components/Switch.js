import React from 'react';
import { Switch as RNSwitch } from 'react-native';

import { Colors } from '../styles';

export const Switch = ({
  onValueChange,
  value = false,
  trackColor = { false: Colors.darkGray, true: Colors.success },
  testID = 'switch',
  thumbColor = Colors.white,
  style,
}) => {
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      trackColor={trackColor}
      thumbColor={thumbColor}
      testID={testID}
      style={style}
    />
  );
};
