import React from 'react';
import { Switch as RNSwitch } from 'react-native';

import Colors from '../constants/colors';

// TODO(https://pathcheck.atlassian.net/browse/SAF-230): make theme aware
export const Switch = ({
  onValueChange,
  value = false,
  trackColor = { false: Colors.GRAY_BACKGROUND, true: Colors.SUCCESS },
  testID = 'switch',
  thumbColor = Colors.WHITE,
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
