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

const large: ViewStyle = {
  paddingTop: Spacing.large,
  paddingBottom: Spacing.large + 1,
};

// Color
const primaryBlue: ViewStyle = {
  backgroundColor: Colors.primaryBlue,
  borderColor: Colors.primaryBlue,
};

// Outline
const outlined: ViewStyle = {
  borderWidth: 1,
  backgroundColor: Colors.transparent,
};

// Combinations
export const largeBlueOutline: ViewStyle = {
  ...base,
  ...large,
  ...primaryBlue,
  ...outlined,
};

// Combinations
export const largeBlue: ViewStyle = {
  ...base,
  ...large,
  ...primaryBlue,
};
