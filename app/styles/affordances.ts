import { ViewStyle } from 'react-native';

import * as Colors from './colors';

export const iconBadge = {
  position: 'absolute',
  right: 22,
  top: 3,
  backgroundColor: Colors.primaryYellow,
  borderRadius: 6,
  width: 12,
  height: 12,
  justifyContent: 'center',
  alignItems: 'center',
};

export const bottomDotBadge = (color: string): ViewStyle => {
  return {
    position: 'absolute',
    bottom: -4,
    backgroundColor: color,
    borderRadius: 6,
    width: 6,
    height: 6,
    justifyContent: 'center',
    alignItems: 'center',
  };
};

export const smallBottomDotBadge = (color: string): ViewStyle => {
  return {
    position: 'absolute',
    bottom: -2,
    backgroundColor: color,
    borderRadius: 2,
    width: 4,
    height: 4,
    justifyContent: 'center',
    alignItems: 'center',
  };
};
