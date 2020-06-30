import { ViewStyle } from 'react-native';

import * as Colors from './colors';
import * as Spacing from './spacing';

export const largeIcon: ViewStyle = {
  height: 70,
  width: 70,
  borderRadius: 70,
  backgroundColor: Colors.onboardingIconBlue,
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: Spacing.large,
};

export const largeBlueIcon: ViewStyle = {
  ...largeIcon,
  backgroundColor: Colors.onboardingIconBlue,
};

export const largeGoldIcon: ViewStyle = {
  ...largeIcon,
  backgroundColor: Colors.onboardingIconYellow,
};
