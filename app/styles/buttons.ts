import { ViewStyle } from 'react-native';

import * as Colors from './colors';
import * as Outlines from './outlines';
import * as Layout from './layout';

const base: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
};

// Size
export const baseHeight = 50;

const large: ViewStyle = {
  paddingTop: 10,
  paddingBottom: 11,
  width: Layout.baseFullWidthWithMargin,
};

// Color
const primaryBlue: ViewStyle = {
  backgroundColor: Colors.primaryBlue,
  borderColor: Colors.primaryBlue,
};

const primaryBlack: ViewStyle = {
  backgroundColor: Colors.darkGray,
  borderColor: Colors.darkGray,
};

const primaryYellow: ViewStyle = {
  backgroundColor: Colors.primaryYellow,
  borderColor: Colors.primaryYellow,
};

// Outline
const rounded: ViewStyle = {
  borderRadius: Outlines.borderRadiusMax,
};

// Combinations
export const largeBlue: ViewStyle = {
  ...base,
  ...large,
  ...rounded,
  ...primaryBlue,
};

export const largeBlack: ViewStyle = {
  ...base,
  ...large,
  ...rounded,
  ...primaryBlack,
};

export const largeYellow: ViewStyle = {
  ...base,
  ...large,
  ...rounded,
  ...primaryYellow,
};

export const borderOnly = (buttonStyle: ViewStyle): ViewStyle => {
  return {
    ...buttonStyle,
    backgroundColor: Colors.transparent,
  };
};
