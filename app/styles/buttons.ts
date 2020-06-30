import { ViewStyle } from 'react-native';

import * as Colors from './colors';
import * as Outlines from './outlines';
import * as Spacing from './spacing';

const base: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: Outlines.baseBorderRadius,
};

// Size
export const baseHeight = 50;

const tiny: ViewStyle = {
  paddingVertical: Spacing.xxxSmall,
  paddingHorizontal: Spacing.xSmall,
};

const medium: ViewStyle = {
  paddingVertical: Spacing.small,
  paddingHorizontal: Spacing.medium,
};

const large: ViewStyle = {
  paddingTop: Spacing.large,
  paddingBottom: Spacing.large + 1,
};

// Border
const rounded: ViewStyle = {
  borderRadius: Outlines.maxBorderRadius,
};

// Color

const primaryBlue: ViewStyle = {
  backgroundColor: Colors.primaryBlue,
  borderColor: Colors.primaryBlue,
};

const white: ViewStyle = {
  backgroundColor: Colors.white,
  borderColor: Colors.white,
};

const tertiary: ViewStyle = {
  backgroundColor: Colors.tertiaryViolet,
  borderColor: Colors.tertiaryViolet,
};

const transparent: ViewStyle = {
  backgroundColor: 'transparent',
};

// Outline
const outlined: ViewStyle = {
  borderWidth: 1,
  backgroundColor: Colors.transparent,
};

// Combinations
export const largeBlue: ViewStyle = {
  ...base,
  ...large,
  ...primaryBlue,
};

export const largeBlueOutline: ViewStyle = {
  ...largeBlue,
  ...outlined,
};

export const mediumBlue: ViewStyle = {
  ...base,
  ...medium,
  ...primaryBlue,
};

export const largeWhite: ViewStyle = {
  ...base,
  ...large,
  ...white,
};

export const largeWhiteDisabled: ViewStyle = {
  ...largeWhite,
  backgroundColor: Colors.semiTransparentWhite,
};

export const largeWhiteOutline: ViewStyle = {
  ...largeWhite,
  ...outlined,
};

export const largeSecondary: ViewStyle = {
  ...base,
  ...large,
};

export const tinyTeritiaryRounded: ViewStyle = {
  ...base,
  ...tiny,
  ...rounded,
  ...tertiary,
};

export const largeTransparent: ViewStyle = {
  ...base,
  ...large,
  ...transparent,
};

export const pill: ViewStyle = {
  borderRadius: 100,
  paddingVertical: Spacing.small,
  paddingHorizontal: Spacing.xLarge,
  backgroundColor: Colors.transparentWhite,
};
