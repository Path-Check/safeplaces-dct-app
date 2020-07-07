import { ViewStyle, TextStyle } from 'react-native';

import * as Colors from './colors';
import * as Spacing from './spacing';
import * as Typography from './typography';

export const small = 30;
export const large = 70;

export const smallIcon: ViewStyle = {
  height: 30,
  width: 30,
  borderRadius: 100,
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: Spacing.small,
};

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

// Exposure History
export const possibleExposure: ViewStyle = {
  backgroundColor: Colors.possibleExposure,
  borderColor: Colors.possibleExposure,
};

export const expectedExposure: ViewStyle = {
  backgroundColor: Colors.expectedExposure,
  borderColor: Colors.expectedExposure,
};

export const possibleExposureText: TextStyle = {
  ...Typography.bold,
  color: Colors.white,
};

export const expectedExposureText: TextStyle = {
  ...Typography.bold,
  color: Colors.darkestGray,
};

export const noExposureText: TextStyle = {
  ...Typography.bold,
  color: Colors.primaryViolet,
};

export const todayText: TextStyle = {
  ...Typography.smallFont,
  ...Typography.bold,
  color: Colors.primaryViolet,
};
